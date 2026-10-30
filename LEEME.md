# Reproductor del tótem

Abre `index.html` en Chrome o Edge. Pulsa F11 para pantalla completa. No requiere instalación ni conexión a internet. El diseño conserva una proporción vertical de 1080 × 1920 y se adapta al espacio disponible.

Toca la portada para comenzar. Las indicaciones, los controles y la barra pulsan durante 7 segundos con el video detenido. Después empieza el video y se ocultan las ayudas. Un toque en el video muestra u oculta los controles. Las cinco zonas transparentes sobre la imagen permiten reiniciar, retroceder 10 segundos, pausar/reproducir, avanzar 10 segundos y volver a la portada. También puedes arrastrar la barra para cambiar de posición. Al finalizar el video vuelve la portada.

Los controles usan `Fondo_Controles.png` y los iconos independientes. Cada icono usa su versión azul al presionarlo y vuelve a blanco al soltar, sin colorear el fondo. El botón central muestra Pause durante la reproducción y Start cuando el video está pausado, también durante las instrucciones.

Durante las instrucciones se muestra `Images/Video_Indicaciones.jpg`, un fotograma extraído a los 0.5 segundos del video de prueba, y la barra se mantiene al 50 % con el punto centrado. El video sigue detenido en cero. Después de los 7 segundos se retira la imagen y la barra refleja el progreso real. Al cambiar el video, reemplaza también esta imagen por un fotograma del nuevo archivo.

Para reemplazar el video, guarda el nuevo archivo como `Images/Video.mp4` y recarga la página. Usa MP4 compatible con el navegador (habitualmente H.264/AAC). El video ocupa todo el lienzo vertical mediante `object-fit: cover`: en el video horizontal de prueba se recortan los lados. Para mostrarlo completo con franjas cambia `object-fit: cover` por `object-fit: contain` en la regla `#video` de `styles.css`.

Si el navegador impide la reproducción automática con sonido tras las indicaciones, aparece un mensaje para iniciarla con un toque.
