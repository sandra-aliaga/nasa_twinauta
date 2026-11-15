# Datos preparados para integración

Los originales se conservan en `../raw/`. Esta carpeta contiene derivados reproducibles, todavía separados de los datos sintéticos de `../demo/` y de la base PostgreSQL.

## Frecuencia cardíaca

- [CSV de la sesión 2_1](physionet_treadmill_1.0.1/heart_rate_2_1.csv): 602 muestras; dos valores ausentes de frecuencia cardíaca.
- [Procedencia y auditoría](physionet_treadmill_1.0.1/heart_rate_2_1.provenance.json): fuente, versión, hashes, transformaciones, unidades, selección y límites.
- Fuente: Mongin, D., García Romero, J., & Alvero Cruz, J. R. (2021). *Treadmill Maximal Exercise Tests from the Exercise Physiology and Human Performance Lab of the University of Malaga* (1.0.1). PhysioNet. https://doi.org/10.13026/7ezk-j442
- Licencia: conservar y consultar `../raw/physionet_treadmill_1.0.1/LICENSE.txt`; el archivo derivado no elimina sus condiciones ni la obligación de atribución.

Reproducir desde `backend/`:

```bash
python -m app.prepare_data --test-id 2_1
```

El comando verifica primero los tres hashes publicados en `SHA256SUMS.txt`, relaciona el test con su participante y comprueba orden y unicidad temporal. Recuenta todas las filas y ausencias de HR, pero extrae únicamente la prueba indicada. La elección de `2_1` es operativa: participante adulto con datos ausentes que permiten representar esa condición; no se seleccionó por un resultado clínico ni como muestra representativa de astronautas.

Columnas: `time_s`, `heart_rate` (beats/min), `speed_kmh`, `missing_reason` y `source_row`. Una celda vacía de HR representa ausencia en el original. No se imputan datos ni se introducen umbrales clínicos. No se interpola, remuestrea ni traslada el reloj terrestre al tiempo de misión.

## Integración disponible y siguientes pasos

1. Revisar estos artefactos y registrar la revisión de la fuente.
2. La grabación está registrada con ID `physionet_treadmill_1_0_1_2_1`, conservando su origen humano terrestre y participante original. No se asocia al historial muscular del astronauta virtual.
3. Se sirve por los endpoints de metadatos y ventanas ya contratados, con límites de 120 segundos y 2000 puntos. El fin exclusivo usa el menor float superior a la última muestra (1046 segundos), para incluirla sin añadir datos ni asumir cadencia.
4. Mantener el torque NASA separado hasta resolver su diccionario, grupos y calendario. El área muscular seguirá como referencia bibliográfica mientras no exista una serie individual adecuada.

El CSV completo no es una respuesta de la API. Los endpoints admiten tanto el ID real documentado como la señal sintética original. El caso ficticio sigue apuntando a la señal sintética. La revisión de la fuente de telemetría cubre procedencia y representación de sus datos, no interpretación clínica; la ficha generada por preparación conserva su estado histórico pendiente.
