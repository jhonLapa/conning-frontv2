"use client"

import { useState, useEffect, useMemo } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EmpresaList } from "@/interfaces/empresas.interface"


interface CompanySelectProps {
  value: EmpresaList | null
  onChange: (company: EmpresaList | null) => void
  placeholder?: string
}

const mockCompanies: EmpresaList[] = [
  { id: 1 , code: "1", razonSocial: "Apple Inc.", ruc: "987654321234", estado: true },
  { id: 2 , code: "2", razonSocial: "Microsoft Corporation", ruc: "123456789012", estado: true },
  { id: 3 , code: "3", razonSocial: "Google LLC", ruc: "456789123456", estado: true },
  { id: 4 , code: "4", razonSocial: "Amazon.com Inc.", ruc: "789123456789", estado: true },
  { id: 5 , code: "5", razonSocial: "Tesla Inc.", ruc: "321654987321", estado: false },
  { id: 6 , code: "6", razonSocial: "Meta Platforms Inc.", ruc: "654987321654", estado: true },
  { id: 7 , code: "7", razonSocial: "Netflix Inc.", ruc: "147258369147", estado: false },
  { id: 8 , code: "8", razonSocial: "Spotify Technology", ruc: "258369147258", estado: true },
  { id: 9 , code: "9", razonSocial: "Uber Technologies", ruc: "369147258369", estado: true },
];

export function EmpresaSelect({ value, onChange, placeholder = "Seleccionar empresa..." }: CompanySelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Simular búsqueda asíncrona
  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return mockCompanies.slice(0, 8) // Mostrar solo las primeras 8 por defecto

    return mockCompanies.filter(
      (company) =>
        company.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.razonSocial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.ruc.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery])

  // Simular delay de búsqueda asíncrona
  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [searchQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">({value.ruc})</span>
              <span className="truncate">{value.razonSocial}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Buscar empresas..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandList>
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">Buscando empresas...</div>
            ) : (
              <>
                <CommandEmpty>No se encontraron empresas.</CommandEmpty>
                <CommandGroup>
                  {filteredCompanies.map((company) => (
                    <CommandItem
                      key={company.id}
                      value={company.razonSocial}
                      onSelect={() => {
                        onChange(company)
                        setOpen(false)
                        setSearchQuery("")
                      }}
                      className="cursor-pointer"
                    >
                      <Check className={cn("mr-2 h-4 w-4", value?.id === company.id ? "opacity-100" : "opacity-0")} />
                      <div className="flex-1">
                        <div className="font-medium">{company.razonSocial}</div>
                        <div className="text-xs text-muted-foreground">
                          {company.code} • {company.ruc} 
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
