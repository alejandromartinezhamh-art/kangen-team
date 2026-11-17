# Genera una voz con Qwen3-TTS a partir de una muestra de la persona (la llama scripts/voz-clonada.mjs, que prepara
# la muestra, su transcripción y el texto). Sin tarjeta gráfica: va en la CPU, unas 4 veces lo que dura el audio.
#   python voz-clonada.py <modelo> <muestra.wav> <texto-muestra.txt> <frases.json> <salida.wav>
# frases.json: [{"texto": "...", "pausa": 0.35}, ...] — la pausa va DESPUÉS de cada frase.
import json
import sys
import time

import numpy as np
import soundfile as sf
import torch
from qwen_tts import Qwen3TTSModel

modelo, muestra, texto_muestra, frases_json, salida = sys.argv[1:6]
frases = json.load(open(frases_json, encoding="utf-8"))
torch.set_num_threads(max(1, torch.get_num_threads()))

inicio = time.time()
m = Qwen3TTSModel.from_pretrained(modelo, device_map="cpu", dtype=torch.float32)
prompt = m.create_voice_clone_prompt(
    ref_audio=muestra, ref_text=open(texto_muestra, encoding="utf-8").read().strip(), x_vector_only_mode=False
)
cargado = time.time()

trozos, frecuencia = [], None
for i, f in enumerate(frases):
    wavs, sr = m.generate_voice_clone(text=f["texto"], language="Spanish", voice_clone_prompt=prompt)
    frecuencia = sr
    trozos.append(np.asarray(wavs[0], dtype=np.float32))
    trozos.append(np.zeros(int(sr * float(f.get("pausa", 0.35))), dtype=np.float32))
    print(f"  frase {i + 1} de {len(frases)} lista", flush=True)

audio = np.concatenate(trozos[:-1]) if trozos else np.zeros(1, dtype=np.float32)
sf.write(salida, audio, frecuencia)
dur = len(audio) / frecuencia
print(f"Voz: {dur:.1f} s · modelo cargado en {cargado - inicio:.0f} s · generada en {time.time() - cargado:.0f} s", flush=True)
