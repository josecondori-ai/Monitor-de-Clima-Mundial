# Weather Monitor - Monitoreo del Clima

Una aplicación web moderna para monitorear el clima en tiempo real usando Next.js, TypeScript y Tailwind CSS.

## 🚀 Características

- 🌍 Mapa interactivo con Mapbox
- 🌤️ Información del clima en tiempo real
- 📱 Diseño responsive
- 🌙 Modo oscuro/claro
- 📊 Pronóstico de 5 días
- 🎯 Marcadores de ciudades principales

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o pnpm
- Cuenta gratuita en OpenWeather
- Cuenta gratuita en Mapbox

## ⚙️ Configuración

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd weather-monitor
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# OpenWeather API Configuration
# Obtén tu API key gratuita en: https://openweathermap.org/api
OPENWEATHER_API_KEY=tu_api_key_de_openweather_aqui

# Mapbox Configuration  
# Obtén tu token gratuito en: https://account.mapbox.com/
NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_de_mapbox_aqui

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Obtener API Keys

#### OpenWeather API Key (Gratuito):
1. Ve a [OpenWeather](https://openweathermap.org/)
2. Regístrate para una cuenta gratuita
3. Ve a "API keys" en tu perfil
4. Copia tu API key
5. Reemplaza `tu_api_key_de_openweather_aqui` en `.env.local`

#### Mapbox Token (Gratuito):
1. Ve a [Mapbox](https://account.mapbox.com/)
2. Regístrate para una cuenta gratuita
3. Ve a "Access tokens"
4. Copia tu token público
5. Reemplaza `tu_token_de_mapbox_aqui` en `.env.local`

## 🏃‍♂️ Ejecutar el proyecto

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 🎯 Cómo usar

1. Abre la aplicación en tu navegador (http://localhost:3000)
2. **Buscar ciudades**: Escribe el nombre de una ciudad en la barra de búsqueda y presiona Enter o haz clic en "Buscar"
3. **Usar el mapa**: Haz clic en cualquier marcador azul en el mapa para ver el clima de esa ciudad
4. **Coordenadas específicas**: Haz clic en cualquier lugar del mapa para obtener coordenadas específicas
5. **Navegación**: Usa los controles del mapa para navegar y hacer zoom
6. **Tema**: Cambia entre modo claro y oscuro usando el botón en la barra de navegación

### 🔍 Ejemplos de búsqueda:
- "Buenos Aires"
- "Madrid"
- "Tokyo"
- "New York"
- "London"
- "Paris"

## 🛠️ Tecnologías utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Maps**: Mapbox GL JS
- **Weather API**: OpenWeather API
- **State Management**: React Hooks
- **Theming**: next-themes

## 📁 Estructura del proyecto

```
weather-monitor/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes de UI (shadcn/ui)
│   ├── navbar.tsx        # Barra de navegación
│   ├── weather-map.tsx   # Componente del mapa
│   └── weather-panel.tsx # Panel de información del clima
├── hooks/                # Custom hooks
│   └── use-weather.ts    # Hook para datos del clima
├── lib/                  # Utilidades y configuraciones
│   ├── utils.ts          # Utilidades generales
│   └── weather-api.ts    # Tipos y utilidades de la API
└── public/               # Archivos estáticos
```

## 🐛 Solución de problemas

### Error: "API key de OpenWeather no configurada"
- Verifica que hayas creado el archivo `.env.local`
- Asegúrate de que `OPENWEATHER_API_KEY` esté configurado correctamente
- Reinicia el servidor de desarrollo después de agregar las variables de entorno

### Error: "Mapbox token no válido"
- Verifica que `NEXT_PUBLIC_MAPBOX_TOKEN` esté configurado correctamente
- Asegúrate de usar el token público, no el secreto

### El mapa no se carga
- Verifica tu conexión a internet
- Asegúrate de que el token de Mapbox sea válido
- Revisa la consola del navegador para errores específicos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

---

**Nota**: Este proyecto usa APIs gratuitas con límites de uso. Para uso en producción, considera planes pagos.
