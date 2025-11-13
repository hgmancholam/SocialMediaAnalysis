"""
Script para redistribuir usuarios georeferenciados dentro de Colombia

Este script lee el dataset.json, identifica todos los usuarios con coordenadas geográficas,
y las redistribuye aleatoriamente dentro del territorio de Colombia.

Límites geográficos de Colombia:
- Latitud: -4.2° (sur) a 12.5° (norte)
- Longitud: -79.0° (oeste) a -66.9° (este)
"""

import json
import random
from typing import Dict, Any, List, Tuple

# Límites geográficos de Colombia
COLOMBIA_BOUNDS = {
    'lat_min': -4.2,
    'lat_max': 12.5,
    'lon_min': -79.0,
    'lon_max': -66.9
}

# Ciudades principales de Colombia con sus coordenadas aproximadas
# Esto ayudará a distribuir usuarios cerca de centros urbanos realísticamente
MAJOR_CITIES = [
    {'name': 'Bogotá', 'lat': 4.7110, 'lon': -74.0721, 'weight': 30},
    {'name': 'Medellín', 'lat': 6.2442, 'lon': -75.5812, 'weight': 15},
    {'name': 'Cali', 'lat': 3.4516, 'lon': -76.5320, 'weight': 12},
    {'name': 'Barranquilla', 'lat': 10.9685, 'lon': -74.7813, 'weight': 10},
    {'name': 'Cartagena', 'lat': 10.3910, 'lon': -75.4794, 'weight': 8},
    {'name': 'Bucaramanga', 'lat': 7.1193, 'lon': -73.1227, 'weight': 6},
    {'name': 'Pereira', 'lat': 4.8133, 'lon': -75.6961, 'weight': 5},
    {'name': 'Santa Marta', 'lat': 11.2408, 'lon': -74.1990, 'weight': 4},
    {'name': 'Cúcuta', 'lat': 7.8939, 'lon': -72.5078, 'weight': 4},
    {'name': 'Manizales', 'lat': 5.0670, 'lon': -75.5174, 'weight': 3},
    {'name': 'Ibagué', 'lat': 4.4389, 'lon': -75.2322, 'weight': 3},
]

def generate_coordinates_near_city(city: Dict[str, Any], radius_deg: float = 0.5) -> Tuple[float, float]:
    """
    Genera coordenadas aleatorias cerca de una ciudad específica.
    
    Args:
        city: Diccionario con información de la ciudad (lat, lon, weight)
        radius_deg: Radio en grados para dispersión (aprox. 55km por 0.5 grados)
    
    Returns:
        Tupla (latitud, longitud)
    """
    # Generar offset aleatorio dentro del radio
    angle = random.uniform(0, 2 * 3.14159)
    distance = random.uniform(0, radius_deg) * random.uniform(0.3, 1.0)  # Más concentrado cerca del centro
    
    lat = city['lat'] + distance * (1 if random.random() > 0.5 else -1)
    lon = city['lon'] + distance * (1 if random.random() > 0.5 else -1)
    
    # Asegurar que está dentro de los límites de Colombia
    lat = max(COLOMBIA_BOUNDS['lat_min'], min(COLOMBIA_BOUNDS['lat_max'], lat))
    lon = max(COLOMBIA_BOUNDS['lon_min'], min(COLOMBIA_BOUNDS['lon_max'], lon))
    
    return lat, lon

def generate_random_coordinates_in_colombia() -> Tuple[float, float]:
    """
    Genera coordenadas aleatorias dentro de Colombia.
    
    70% cerca de ciudades principales
    30% distribuido aleatoriamente en el país
    
    Returns:
        Tupla (latitud, longitud)
    """
    if random.random() < 0.7:
        # Seleccionar ciudad basada en peso
        total_weight = sum(city['weight'] for city in MAJOR_CITIES)
        rand_val = random.uniform(0, total_weight)
        current_sum = 0
        
        for city in MAJOR_CITIES:
            current_sum += city['weight']
            if rand_val <= current_sum:
                return generate_coordinates_near_city(city)
    
    # Distribución aleatoria en todo el país
    lat = random.uniform(COLOMBIA_BOUNDS['lat_min'], COLOMBIA_BOUNDS['lat_max'])
    lon = random.uniform(COLOMBIA_BOUNDS['lon_min'], COLOMBIA_BOUNDS['lon_max'])
    
    return lat, lon

def redistribute_users_to_colombia(dataset: Dict[str, Any]) -> Dict[str, Any]:
    """
    Redistribuye todos los usuarios georeferenciados dentro de Colombia.
    
    Args:
        dataset: Dataset completo con tweets, users, enriched_tweets
    
    Returns:
        Dataset modificado con nuevas coordenadas
    """
    users_updated = 0
    users_dict = dataset.get('users', {})
    
    print(f"Procesando {len(users_dict)} usuarios...")
    
    for user_id, user in users_dict.items():
        # Verificar si el usuario tiene coordenadas geográficas
        if 'geo' in user and user['geo'] is not None:
            if isinstance(user['geo'], dict) and 'x' in user['geo'] and 'y' in user['geo']:
                # Generar nuevas coordenadas en Colombia
                lat, lon = generate_random_coordinates_in_colombia()
                
                # Actualizar coordenadas (x = longitud, y = latitud)
                user['geo']['x'] = round(lon, 6)
                user['geo']['y'] = round(lat, 6)
                
                users_updated += 1
                
                if users_updated % 100 == 0:
                    print(f"  Procesados {users_updated} usuarios...")
    
    print(f"\n✓ Total usuarios actualizados: {users_updated}")
    
    return dataset

def main():
    """Función principal para ejecutar la redistribución."""
    input_file = '../public/data/dataset.json'
    output_file = '../public/data/dataset.json'
    backup_file = '../public/data/dataset_backup_original.json'
    
    print("=" * 60)
    print("REDISTRIBUCIÓN DE USUARIOS GEOREFERENCIADOS A COLOMBIA")
    print("=" * 60)
    print()
    
    # Cargar dataset
    print("1. Cargando dataset...")
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            dataset = json.load(f)
        print(f"   ✓ Dataset cargado exitosamente")
    except FileNotFoundError:
        print(f"   ✗ Error: No se encontró el archivo {input_file}")
        return
    except json.JSONDecodeError as e:
        print(f"   ✗ Error al parsear JSON: {e}")
        return
    
    # Crear backup
    print("\n2. Creando backup del dataset original...")
    try:
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(dataset, f, ensure_ascii=False, indent=2)
        print(f"   ✓ Backup guardado en: {backup_file}")
    except Exception as e:
        print(f"   ✗ Error al crear backup: {e}")
        return
    
    # Redistribuir usuarios
    print("\n3. Redistribuyendo usuarios a Colombia...")
    dataset_modified = redistribute_users_to_colombia(dataset)
    
    # Guardar dataset modificado
    print("\n4. Guardando dataset modificado...")
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(dataset_modified, f, ensure_ascii=False, indent=2)
        print(f"   ✓ Dataset guardado en: {output_file}")
    except Exception as e:
        print(f"   ✗ Error al guardar dataset: {e}")
        return
    
    print("\n" + "=" * 60)
    print("REDISTRIBUCIÓN COMPLETADA EXITOSAMENTE")
    print("=" * 60)
    print("\nNotas:")
    print("- 70% de usuarios distribuidos cerca de ciudades principales")
    print("- 30% de usuarios distribuidos aleatoriamente en Colombia")
    print(f"- Backup original guardado en: {backup_file}")
    print("\nCiudades principales consideradas:")
    for city in MAJOR_CITIES[:5]:
        print(f"  • {city['name']} (peso: {city['weight']}%)")
    print("  • ... y 6 ciudades más")

if __name__ == '__main__':
    main()
