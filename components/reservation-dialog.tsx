"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/auth-context"
import { mockUsers } from "@/lib/mock-data"
import type { Item, Reservation } from "@/lib/types"

const safeNumber = (value: any): number => {
  const num = Number(value)
  return isNaN(num) || !isFinite(num) ? 0 : num
}

interface ReservationDialogProps {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddReservation: (reservation: Omit<Reservation, "id" | "reserved_at">) => void
}

export function ReservationDialog({ item, open, onOpenChange, onAddReservation }: ReservationDialogProps) {
  const { user } = useAuth()
  const [quantity, setQuantity] = useState("")
  const [reservedBy, setReservedBy] = useState(user?.name || "")
  const [notes, setNotes] = useState("")

  const reservationUsers = mockUsers.filter((u) => u.role === "REZERVACIJA")
  const userNames = reservationUsers.map((u) => u.name).sort()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const reservationCode = `RES${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    onAddReservation({
      item_id: item.id,
      quantity: Number.parseInt(quantity),
      reserved_by: reservedBy,
      reservation_code: reservationCode,
      notes: notes || undefined,
    })

    setQuantity("")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="resize">
        <DialogHeader>
          <DialogTitle>Rezervacija Artikla</DialogTitle>
          <DialogDescription>
            {item.name} ({item.code})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Dostupno</Label>
            <div className="text-2xl font-bold">{safeNumber(item.available)}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Količina *</Label>
            <Input
              id="quantity"
              type="number"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reserved-by">Rezervisao *</Label>
            <Select value={reservedBy} onValueChange={setReservedBy} required>
              <SelectTrigger id="reserved-by">
                <SelectValue placeholder="Izaberite korisnika" />
              </SelectTrigger>
              <SelectContent>
                {userNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Napomena</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Otkaži
            </Button>
            <Button type="submit">Rezerviši</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
