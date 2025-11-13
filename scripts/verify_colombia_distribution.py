"""
Script de verificación de distribución geográfica en Colombia

Verifica que todas las coordenadas de usuarios estén dentro de los límites de Colombia
y muestra estadísticas de la distribución.
"""

import json
from collections import defaultdict

# Límites geográficos de Colombia
COLOMBIA_BOUNDS = {
    'lat_min': -4.2,
    'lat_max': 12.5,
    'lon_min': -79.0,
    'lon_max': -66.9
}

def check_coordinates_in_colombia():
    """Verifica y muestra estadísticas de la distribución geográfica."""
    
    input_file = '../public/data/dataset.json'
    
    print("=" * 60)
    print("VERIFICACIÓN DE DISTRIBUCIÓN GEOGRÁFICA EN COLOMBIA")
    print("=" * 60)
    print()
    
    # Cargar dataset
    print("Cargando dataset...")
    with open(input_file, 'r', encoding='utf-8') as f:
        dataset = json.load(f)
    
    users_dict = dataset.get('users', {})
    
    # Contadores
    total_users = len(users_dict)
    users_with_geo = 0
    users_in_colombia = 0
    users_outside_colombia = []
    
    lat_values = []
    lon_values = []
    
    # Analizar usuarios
    for user_id, user in users_dict.items():
        if 'geo' in user and user['geo'] is not None:
            if isinstance(user['geo'], dict) and 'x' in user['geo'] and 'y' in user['geo']:
                users_with_geo += 1
                lon = user['geo']['x']
                lat = user['geo']['y']
                
                lat_values.append(lat)
                lon_values.append(lon)
                
                # Verificar si está en Colombia
                if (COLOMBIA_BOUNDS['lat_min'] <= lat <= COLOMBIA_BOUNDS['lat_max'] and
                    COLOMBIA_BOUNDS['lon_min'] <= lon <= COLOMBIA_BOUNDS['lon_max']):
                    users_in_colombia += 1
                else:
                    users_outside_colombia.append({
                        'user_id': user_id,
                        'username': user.get('username', 'N/A'),
                        'lat': lat,
                        'lon': lon
                    })
    
    # Mostrar resultados
    print(f"\n📊 ESTADÍSTICAS:")
    print(f"{'─' * 60}")
    print(f"Total de usuarios:              {total_users:>8}")
    print(f"Usuarios con coordenadas:       {users_with_geo:>8} ({users_with_geo/total_users*100:.1f}%)")
    print(f"Usuarios en Colombia:           {users_in_colombia:>8} ({users_in_colombia/users_with_geo*100:.1f}%)")
    print(f"Usuarios fuera de Colombia:     {len(users_outside_colombia):>8}")
    
    if lat_values and lon_values:
        print(f"\n📍 RANGOS DE COORDENADAS:")
        print(f"{'─' * 60}")
        print(f"Latitud:")
        print(f"  Mínima:  {min(lat_values):>8.4f}° (límite: {COLOMBIA_BOUNDS['lat_min']:.1f}°)")
        print(f"  Máxima:  {max(lat_values):>8.4f}° (límite: {COLOMBIA_BOUNDS['lat_max']:.1f}°)")
        print(f"  Promedio: {sum(lat_values)/len(lat_values):>7.4f}°")
        
        print(f"\nLongitud:")
        print(f"  Mínima:  {min(lon_values):>8.4f}° (límite: {COLOMBIA_BOUNDS['lon_min']:.1f}°)")
        print(f"  Máxima:  {max(lon_values):>8.4f}° (límite: {COLOMBIA_BOUNDS['lon_max']:.1f}°)")
        print(f"  Promedio: {sum(lon_values)/len(lon_values):>7.4f}°")
    
    # Mostrar usuarios fuera de Colombia (si los hay)
    if users_outside_colombia:
        print(f"\n⚠️  USUARIOS FUERA DE COLOMBIA:")
        print(f"{'─' * 60}")
        for i, user in enumerate(users_outside_colombia[:10], 1):
            print(f"{i}. @{user['username']}: ({user['lat']:.4f}, {user['lon']:.4f})")
        if len(users_outside_colombia) > 10:
            print(f"... y {len(users_outside_colombia) - 10} más")
    else:
        print(f"\n✅ TODOS LOS USUARIOS ESTÁN DENTRO DE COLOMBIA")
    
    print(f"\n{'=' * 60}")
    
    if users_in_colombia == users_with_geo:
        print("✓ VERIFICACIÓN EXITOSA: Todos los usuarios georeferenciados")
        print("  están correctamente ubicados dentro de Colombia")
    else:
        print("✗ ADVERTENCIA: Hay usuarios fuera de los límites de Colombia")
    
    print(f"{'=' * 60}\n")

if __name__ == '__main__':
    check_coordinates_in_colombia()
