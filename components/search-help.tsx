"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

export function SearchHelp() {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <CardTitle className="text-sm">Cómo buscar ciudades</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Escribe el nombre de la ciudad en la barra de búsqueda</p>
          <p>• Presiona Enter o haz clic en "Buscar"</p>
          <p>• Ejemplos: "Buenos Aires", "Madrid", "Tokyo", "New York"</p>
          <p>• También puedes hacer clic en los marcadores del mapa</p>
        </div>
      </CardContent>
    </Card>
  )
}
