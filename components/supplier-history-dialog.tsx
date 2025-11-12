"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Item, InputHistory } from "@/lib/types"

interface SupplierHistoryDialogProps {
  item: Item
  inputHistory: InputHistory[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupplierHistoryDialog({ item, inputHistory, open, onOpenChange }: SupplierHistoryDialogProps) {
  const history = inputHistory
    .filter((h) => h.item_id === item.id)
    .sort((a, b) => new Date(b.input_date).getTime() - new Date(a.input_date).getTime())

  const totalQuantity = history.reduce((sum, h) => sum + h.quantity, 0)
  const totalValue = history.reduce((sum, h) => sum + h.quantity * h.price, 0)
  const uniqueSuppliers = new Set(history.map((h) => h.supplier))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto resize">
        <DialogHeader>
          <DialogTitle>Istorija Dobavljača - {item.name}</DialogTitle>
          <DialogDescription>
            Šifra: {item.code} | Projekat: {item.project}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Ukupna Količina</div>
            <div className="text-2xl font-bold">{totalQuantity}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Ukupna Vrednost</div>
            <div className="text-2xl font-bold">{totalValue.toFixed(2)} RSD</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Broj Dobavljača</div>
            <div className="text-2xl font-bold">{uniqueSuppliers.size}</div>
          </div>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum i Vreme</TableHead>
                <TableHead>Dobavljač</TableHead>
                <TableHead className="text-right">Količina</TableHead>
                <TableHead className="text-right">Cena po Jedinici</TableHead>
                <TableHead className="text-right">Ukupna Vrednost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nema istorije ulaza
                  </TableCell>
                </TableRow>
              ) : (
                history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">
                      {new Date(entry.input_date).toLocaleString("sr-RS", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{entry.supplier}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{entry.quantity}</TableCell>
                    <TableCell className="text-right">{entry.price.toFixed(2)} RSD</TableCell>
                    <TableCell className="text-right font-bold">
                      {(entry.quantity * entry.price).toFixed(2)} RSD
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {uniqueSuppliers.size > 1 && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Dobavljači po Ceni</h4>
            <div className="space-y-2">
              {Array.from(uniqueSuppliers).map((supplier) => {
                const supplierEntries = history.filter((h) => h.supplier === supplier)
                const avgPrice = supplierEntries.reduce((sum, h) => sum + h.price, 0) / supplierEntries.length
                const totalQty = supplierEntries.reduce((sum, h) => sum + h.quantity, 0)
                return (
                  <div key={supplier} className="flex justify-between items-center">
                    <span className="font-medium">{supplier}</span>
                    <div className="text-sm text-muted-foreground">
                      Prosečna cena: {avgPrice.toFixed(2)} RSD | Ukupno: {totalQty} kom
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
