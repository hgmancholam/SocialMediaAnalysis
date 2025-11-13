import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Noticias políticas recientes de Colombia (2025)
NOTICIAS_BASE = [
    "Precandidatos de derecha se reúnen para crear coalición que complemente 'megaconsulta' de Gaviria y Uribe",
    "Partido Liberal presentó tutela contra el Nuevo Liberalismo por nombre y logo",
    "En Marcha, partido de Juan Fernando Cristo, podrá postular candidatos a Congreso y Presidencia",
    "Armando Benedetti pide excusas a la magistrada Cristina Lombana tras ataques verbales",
    "Gustavo Petro aclara alcances de la suspensión de cooperación en inteligencia con EE.UU.",
    "Juan Carlos Pinzón promete recuperar el orden y proyectar a Colombia como potencia global",
    "Héctor Olimpo Espinosa choca con Juan Guillermo Zuluaga en la Fuerza de las Regiones",
    "Gloria Arizabaleta responde por polémica de inspección al Consejo de Estado",
    "Juliana Guerrero y el escándalo por títulos académicos falsos en el Congreso",
    "Luis Carlos Reyes critica propuesta de Abelardo de la Espriella sobre legalización de dinero de narcos",
    "Gobierno oficializa a Ruth Maritza Quevedo como viceministra de Agua y Saneamiento",
    "Senado rinde homenaje a Horacio Serpa a cinco años de su muerte",
    "Unión Patriótica se retracta en caso de presunta superación de topes de campaña Petro",
    "Cancillería se reacomoda con nuevo Viceministerio de Asuntos Migratorios",
    "Proyecto de ley sanciona a candidatos que no asistan a debates presidenciales",
    "FBI y DEA seguirán cooperando con agencias de inteligencia colombianas",
    "Elecciones 2026: se configuran alianzas de derecha, centro y petrismo",
    "CNE investiga financiación irregular de campañas políticas",
    "Reforma política avanza en el Congreso con propuestas de cambio electoral",
    "Debate por narcotráfico y política en Colombia continúa"
]

# Entidades políticas mencionadas frecuentemente
ENTIDADES = {
    "personas": [
        "Gustavo Petro", "Álvaro Uribe", "César Gaviria", "Juan Fernando Cristo",
        "Armando Benedetti", "Cristina Lombana", "Juan Carlos Pinzón", "Héctor Olimpo Espinosa",
        "Juan Guillermo Zuluaga", "Gloria Arizabaleta", "Roy Barreras", "Juliana Guerrero",
        "Luis Carlos Reyes", "Abelardo de la Espriella", "Ruth Maritza Quevedo",
        "Horacio Serpa", "Jennifer Pedraza", "Juan Manuel Galán", "Andrés Pastrana",
        "Iván Duque", "Claudia López", "Federico Gutiérrez", "Sergio Fajardo",
        "María Fernanda Cabal", "Miguel Uribe", "Angélica Lozano", "Jorge Robledo",
        "Gustavo Bolívar", "Katherine Miranda", "Carlos Fernando Galán"
    ],
    "organizaciones": [
        "Pacto Histórico", "Centro Democrático", "Partido Liberal", "Partido Conservador",
        "Cambio Radical", "Nuevo Liberalismo", "En Marcha", "Fuerza de las Regiones",
        "Alianza Verde", "Polo Democrático", "Unión Patriótica", "CNE", "Corte Constitucional",
        "Consejo de Estado", "Corte Suprema", "Senado", "Cámara de Representantes",
        "FBI", "DEA", "Cancillería", "Ministerio de Justicia", "Fiscalía General"
    ],
    "lugares": [
        "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Bucaramanga",
        "Cúcuta", "Pereira", "Santa Marta", "Manizales", "Ibagué", "Pasto",
        "Armenia", "Villavicencio", "Valledupar", "Montería", "Neiva", "Popayán",
        "Tunja", "Quibdó", "Riohacha", "Leticia", "Yopal", "Arauca", "Florencia"
    ],
    "eventos": [
        "elecciones 2026", "consulta popular", "reforma política", "acuerdo de paz",
        "plebiscito", "referendo", "debate presidencial", "convención", "coalición",
        "megaconsulta", "alianza electoral", "campaña presidencial", "primarias"
    ]
}

# Ciudades colombianas con coordenadas
CIUDADES = {
    "Bogotá": {"x": -74.0721, "y": 4.7110},
    "Medellín": {"x": -75.5636, "y": 6.2476},
    "Cali": {"x": -76.5225, "y": 3.4516},
    "Barranquilla": {"x": -74.7813, "y": 10.9639},
    "Cartagena": {"x": -75.5144, "y": 10.3910},
    "Bucaramanga": {"x": -73.1198, "y": 7.1193},
    "Cúcuta": {"x": -72.5074, "y": 7.8939},
    "Pereira": {"x": -75.6967, "y": 4.8133},
    "Santa Marta": {"x": -74.1990, "y": 11.2408},
    "Manizales": {"x": -75.5152, "y": 5.0689},
    "Ibagué": {"x": -75.2322, "y": 4.4389},
    "Pasto": {"x": -77.2814, "y": 1.2136},
    "Villavicencio": {"x": -73.6350, "y": 4.1420},
    "Armenia": {"x": -75.6812, "y": 4.5339},
    "Valledupar": {"x": -73.2506, "y": 10.4631},
    "Montería": {"x": -75.8878, "y": 8.7479},
    "Neiva": {"x": -75.2819, "y": 2.9273},
    "Popayán": {"x": -76.6063, "y": 2.4448},
    "Tunja": {"x": -73.3678, "y": 5.5353},
    "Yopal": {"x": -72.3959, "y": 5.3378}
}

# Nombres colombianos típicos
NOMBRES = [
    "María", "Juan", "Carlos", "Ana", "Luis", "Diana", "Pedro", "Laura", "Jorge", "Camila",
    "Andrés", "Valentina", "Santiago", "Daniela", "Miguel", "Sofía", "David", "Isabella",
    "Fernando", "Gabriela", "Alejandro", "Natalia", "Ricardo", "Marcela", "Mauricio", "Carolina",
    "Sebastián", "Juliana", "Felipe", "Andrea", "Javier", "Paola", "César", "Claudia",
    "Hernán", "Martha", "Rodrigo", "Gloria", "Gustavo", "Patricia", "Oscar", "Beatriz",
    "Fabián", "Mónica", "Iván", "Sandra", "Alberto", "Lucía", "Álvaro", "Rosa"
]

APELLIDOS = [
    "García", "Rodríguez", "Martínez", "López", "González", "Pérez", "Sánchez", "Ramírez",
    "Torres", "Flores", "Rivera", "Gómez", "Díaz", "Hernández", "Jiménez", "Moreno",
    "Muñoz", "Álvarez", "Romero", "Gutiérrez", "Vargas", "Castro", "Ortiz", "Rojas",
    "Mendoza", "Silva", "Herrera", "Medina", "Aguilar", "Vega", "Ríos", "Reyes",
    "Ruiz", "Cruz", "Morales", "Molina", "Castillo", "Suárez", "Ramos", "Campos"
]

# Plantillas de tweets
PLANTILLAS_TWEETS = [
    "🚨 URGENTE: {noticia}. ¿Qué opinan? #Colombia #Política",
    "{noticia}. Esto cambia todo para las elecciones 2026. #EleccionesColombia",
    "RT @{usuario}: {noticia} #Petrismo #Uribismo",
    "No puedo creer lo que está pasando con {entidad}. {noticia} 😱",
    "BREAKING: {noticia}. Seguimos informando. #NoticiasColombia",
    "{noticia}. Mi opinión: esto es un golpe a la democracia.",
    "¡Atención Colombia! {noticia}. ¿Estamos preparados para lo que viene?",
    "Análisis: {noticia}. Las implicaciones son enormes. 🧵👇",
    "{noticia}. El pueblo colombiano merece respuestas. #TransparenciaYa",
    "📢 {noticia}. Hora de que el Congreso actúe.",
    "{entidad} acaba de {accion}. {noticia} #PolíticaColombia",
    "Increíble: {noticia}. ¿Hasta cuándo? #Colombia2026",
    "RT: {noticia}. Esto lo cambia todo para {lugar}.",
    "{noticia}. Los colombianos estamos cansados de la corrupción. 😤",
    "🔴 EN VIVO: {noticia}. Síguenos para más información.",
    "{noticia}. ¿Ustedes qué piensan? Debate abierto 💬",
    "HILO: Todo lo que necesitas saber sobre {noticia} 🧵",
    "{noticia}. La oposición debe pronunciarse YA. #OpinionPublica",
    "Después de {evento}, ahora {noticia}. Colombia no para.",
    "{noticia} en {lugar}. Los medios no quieren que sepas esto."
]

# Acciones para tweets
ACCIONES = [
    "anunció su candidatura", "se pronunció sobre", "criticó duramente",
    "defendió su posición", "cuestionó las acciones de", "propuso una alianza con",
    "rechazó las acusaciones de", "confirmó su apoyo a", "negó rotundamente",
    "exigió explicaciones a", "celebró la decisión de", "lamentó profundamente"
]

def generar_nombre_usuario() -> str:
    """Genera un nombre de usuario aleatorio"""
    nombre = random.choice(NOMBRES)
    apellido = random.choice(APELLIDOS)
    numero = random.randint(1, 9999)
    
    opciones = [
        f"{nombre}{apellido}{numero}",
        f"{nombre}_{apellido}",
        f"{apellido}{nombre}",
        f"{nombre.lower()}{numero}",
        f"{nombre}{apellido[0]}",
    ]
    return random.choice(opciones)

def generar_usuario(user_id: str) -> Dict[str, Any]:
    """Genera un usuario ficticio"""
    nombre_completo = f"{random.choice(NOMBRES)} {random.choice(APELLIDOS)}"
    ciudad = random.choice(list(CIUDADES.keys()))
    tiene_geo = random.random() > 0.3  # 70% tienen coordenadas
    
    usuario = {
        "name": nombre_completo,
        "username": generar_nombre_usuario(),
        "id": user_id,
        "location": ciudad if random.random() > 0.1 else random.choice(list(CIUDADES.keys())),
        "verified": random.random() < 0.05,  # 5% verificados
        "public_metrics": {
            "followers_count": random.randint(10, 50000),
            "following_count": random.randint(20, 5000),
            "tweet_count": random.randint(100, 300000),
            "listed_count": random.randint(0, 500),
            "like_count": random.randint(100, 200000),
            "media_count": random.randint(0, 1000)
        },
        "created_at": (datetime.now() - timedelta(days=random.randint(365, 5000))).strftime("%Y-%m-%dT%H:%M:%S.000Z")
    }
    
    if tiene_geo and ciudad in CIUDADES:
        usuario["geo"] = {
            "x": CIUDADES[ciudad]["x"] + random.uniform(-0.5, 0.5),
            "y": CIUDADES[ciudad]["y"] + random.uniform(-0.5, 0.5)
        }
    
    return usuario

def generar_tweet_text() -> str:
    """Genera el texto de un tweet basado en noticias reales"""
    plantilla = random.choice(PLANTILLAS_TWEETS)
    noticia = random.choice(NOTICIAS_BASE)
    entidad = random.choice(ENTIDADES["personas"] + ENTIDADES["organizaciones"])
    lugar = random.choice(ENTIDADES["lugares"])
    evento = random.choice(ENTIDADES["eventos"])
    accion = random.choice(ACCIONES)
    usuario_random = generar_nombre_usuario()
    
    # Truncar si es muy largo
    texto = plantilla.format(
        noticia=noticia[:100],
        entidad=entidad,
        lugar=lugar,
        evento=evento,
        accion=accion,
        usuario=usuario_random
    )
    
    # Twitter tiene límite de 280 caracteres
    if len(texto) > 280:
        texto = texto[:277] + "..."
    
    return texto

def analizar_sentimiento(texto: str) -> Dict[str, Any]:
    """Analiza el sentimiento del tweet (simulado)"""
    # Palabras clave para análisis simplificado
    palabras_positivas = ["excelente", "bien", "apoyo", "celebró", "gran", "esperanza", "progreso", "éxito"]
    palabras_negativas = ["mal", "crisis", "corrupción", "escándalo", "cansados", "golpe", "crítica", "rechazo"]
    
    texto_lower = texto.lower()
    
    # Contar palabras
    count_pos = sum(1 for p in palabras_positivas if p in texto_lower)
    count_neg = sum(1 for p in palabras_negativas if p in texto_lower)
    
    # Determinar sentimiento
    if count_neg > count_pos:
        return {
            "sentiment": "negative",
            "confidence_scores": {
                "positive": random.uniform(0.01, 0.15),
                "neutral": random.uniform(0.15, 0.35),
                "negative": random.uniform(0.55, 0.98)
            }
        }
    elif count_pos > count_neg:
        return {
            "sentiment": "positive",
            "confidence_scores": {
                "positive": random.uniform(0.55, 0.95),
                "neutral": random.uniform(0.05, 0.35),
                "negative": random.uniform(0.01, 0.15)
            }
        }
    else:
        return {
            "sentiment": "neutral",
            "confidence_scores": {
                "positive": random.uniform(0.05, 0.25),
                "neutral": random.uniform(0.65, 0.90),
                "negative": random.uniform(0.05, 0.25)
            }
        }

def extraer_entidades(texto: str) -> List[Dict[str, Any]]:
    """Extrae entidades mencionadas en el tweet"""
    entidades_encontradas = []
    
    # Buscar personas
    for persona in ENTIDADES["personas"]:
        if persona in texto:
            entidades_encontradas.append({
                "text": persona,
                "category": "Person",
                "confidence": random.uniform(0.85, 1.0)
            })
    
    # Buscar organizaciones
    for org in ENTIDADES["organizaciones"]:
        if org in texto:
            entidades_encontradas.append({
                "text": org,
                "category": "Organization",
                "confidence": random.uniform(0.75, 0.95)
            })
    
    # Buscar lugares
    for lugar in ENTIDADES["lugares"]:
        if lugar in texto:
            entidades_encontradas.append({
                "text": lugar,
                "category": "Location",
                "confidence": random.uniform(0.80, 0.98)
            })
    
    # Buscar eventos
    for evento in ENTIDADES["eventos"]:
        if evento in texto:
            entidades_encontradas.append({
                "text": evento,
                "category": "Event",
                "confidence": random.uniform(0.70, 0.90)
            })
    
    return entidades_encontradas[:5]  # Máximo 5 entidades

def generar_tweet(tweet_id: str, author_id: str, base_time: datetime) -> Dict[str, Any]:
    """Genera un tweet completo"""
    texto = generar_tweet_text()
    timestamp = base_time - timedelta(
        hours=random.randint(0, 72),
        minutes=random.randint(0, 59),
        seconds=random.randint(0, 59)
    )
    
    # Métricas realistas con distribución exponencial
    base_engagement = random.expovariate(0.01)
    
    return {
        "id": tweet_id,
        "text": texto,
        "author_id": author_id,
        "created_at": timestamp.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
        "lang": "es",
        "possibly_sensitive": random.random() < 0.05,
        "edit_history_tweet_ids": [tweet_id],
        "public_metrics": {
            "retweet_count": int(random.expovariate(0.01) * 10),
            "reply_count": int(random.expovariate(0.05) * 5),
            "like_count": int(random.expovariate(0.01) * 20),
            "quote_count": int(random.expovariate(0.1) * 2),
            "bookmark_count": int(random.expovariate(0.1) * 3),
            "impression_count": int(base_engagement * 100)
        }
    }

def generar_tweet_con_sentimiento(tweet: Dict[str, Any]) -> Dict[str, Any]:
    """Genera la versión con análisis de sentimiento del tweet"""
    sentimiento = analizar_sentimiento(tweet["text"])
    entidades = extraer_entidades(tweet["text"])
    
    return {
        "id": tweet["id"],
        "text": tweet["text"],
        "created_at": tweet["created_at"],
        "sentiment": sentimiento["sentiment"],
        "confidence_scores": sentimiento["confidence_scores"],
        "entities": entidades,
        "geo": None
    }

def generar_dataset(num_tweets: int = 5000) -> Dict[str, Any]:
    """Genera el dataset completo"""
    print(f"🚀 Generando {num_tweets} tweets ficticios...")
    
    # Cargar dataset existente
    try:
        with open("public/data/dataset.json", "r", encoding="utf-8") as f:
            dataset_existente = json.load(f)
    except FileNotFoundError:
        print("⚠️ No se encontró dataset existente, creando desde cero")
        dataset_existente = {"tweets": [], "users": {}, "places": {}, "sentimiento": []}
    
    # Generar usuarios (aproximadamente 1 usuario por cada 10 tweets)
    num_usuarios = num_tweets // 10
    usuarios_nuevos = {}
    user_ids = []
    
    print(f"👥 Generando {num_usuarios} usuarios...")
    for i in range(num_usuarios):
        user_id = f"1{random.randint(100000000000000000, 999999999999999999)}"
        usuarios_nuevos[user_id] = generar_usuario(user_id)
        user_ids.append(user_id)
        
        if (i + 1) % 100 == 0:
            print(f"   Usuarios generados: {i + 1}/{num_usuarios}")
    
    # Generar tweets
    tweets_nuevos = []
    sentimientos_nuevos = []
    base_time = datetime.now()
    
    print(f"📝 Generando {num_tweets} tweets...")
    for i in range(num_tweets):
        tweet_id = f"1{random.randint(100000000000000000, 999999999999999999)}"
        author_id = random.choice(user_ids)
        
        tweet = generar_tweet(tweet_id, author_id, base_time)
        tweet_sentimiento = generar_tweet_con_sentimiento(tweet)
        
        tweets_nuevos.append(tweet)
        sentimientos_nuevos.append(tweet_sentimiento)
        
        if (i + 1) % 500 == 0:
            print(f"   Tweets generados: {i + 1}/{num_tweets}")
    
    # Combinar con dataset existente
    dataset_combinado = {
        "tweets": dataset_existente["tweets"] + tweets_nuevos,
        "users": {**dataset_existente["users"], **usuarios_nuevos},
        "places": dataset_existente["places"],
        "sentimiento": dataset_existente["sentimiento"] + sentimientos_nuevos
    }
    
    print(f"✅ Dataset generado exitosamente!")
    print(f"   Total tweets: {len(dataset_combinado['tweets'])}")
    print(f"   Total usuarios: {len(dataset_combinado['users'])}")
    print(f"   Total sentimientos: {len(dataset_combinado['sentimiento'])}")
    
    return dataset_combinado

if __name__ == "__main__":
    print("=" * 60)
    print("GENERADOR DE DATOS FICTICIOS - ANÁLISIS REDES SOCIALES")
    print("=" * 60)
    
    dataset = generar_dataset(5000)
    
    # Guardar dataset
    output_path = "public/data/dataset.json"
    print(f"\n💾 Guardando dataset en {output_path}...")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(dataset, f, ensure_ascii=False, indent=4)
    
    print(f"✅ Dataset guardado exitosamente!")
    print(f"\n📊 Estadísticas finales:")
    print(f"   - Tweets totales: {len(dataset['tweets'])}")
    print(f"   - Usuarios totales: {len(dataset['users'])}")
    print(f"   - Análisis de sentimiento: {len(dataset['sentimiento'])}")
    print("\n" + "=" * 60)
