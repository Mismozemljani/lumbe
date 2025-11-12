"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { mockUsers } from "@/lib/mock-data"
import type { Item, Pickup } from "@/lib/types"

const safeNumber = (value: any): number => {
  const num = Number(value)
  return isNaN(num) || !isFinite(num) ? 0 : num
}

interface PickupDialogProps {
  item: Item
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPickup: (pickup: Omit<Pickup, "id" | "picked_up_at" | "confirmed_at">) => void
}

export function PickupDialog({ item, open, onOpenChange, onAddPickup }: PickupDialogProps) {
  const { user } = useAuth()
  const [quantity, setQuantity] = useState("")
  const [pickedUpBy, setPickedUpBy] = useState(user?.name || "")
  const [confirmationCode, setConfirmationCode] = useState("")
  const [notes, setNotes] = useState("")
  const [codeError, setCodeError] = useState("")

  const pickupUsers = mockUsers.filter((u) => u.role === "PREUZIMANJE")
  const userNames = pickupUsers.map((u) => u.name).sort()

  const handleCodeChange = (value: string) => {
    setConfirmationCode(value)
    if (value.length > 0 && value.length !== 6) {
      setCodeError("Kod mora imati tačno 6 karaktera")
    } else {
      setCodeError("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (confirmationCode && confirmationCode.length !== 6) {
      setCodeError("Kod mora imati tačno 6 karaktera")
      return
    }

    const selectedUser = pickupUsers.find((u) => u.name === pickedUpBy)
    if (!selectedUser) {
      setCodeError("Morate izabrati korisnika")
      return
    }

    if (!selectedUser.userCode) {
      setCodeError("Odabrani korisnik nema dodeljenu šifru")
      return
    }

    if (confirmationCode.toUpperCase() !== selectedUser.userCode.toUpperCase()) {
      setCodeError(`Pogrešna šifra. Možete koristiti samo svoju dodeljenu šifru: ${selectedUser.userCode}`)
      return
    }

    onAddPickup({
      item_id: item.id,
      quantity: safeNumber(quantity),
      picked_up_by: pickedUpBy,
      confirmation_code: confirmationCode || undefined,
      notes: notes || undefined,
    })

    setQuantity("")
    setConfirmationCode("")
    setNotes("")
    setCodeError("")
  }

  const isCodeValid = confirmationCode.length === 6

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="resize">
        <DialogHeader>
          <DialogTitle>Preuzimanje Artikla</DialogTitle>
          <DialogDescription>
            {item.name} ({item.code})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Dostupno na stanju</Label>
            <div className="text-2xl font-bold">{safeNumber(item.stock).toFixed(2)}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup-quantity">Količina *</Label>
            <Input
              id="pickup-quantity"
              type="number"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="picked-up-by">Preuzima *</Label>
            <Select value={pickedUpBy} onValueChange={setPickedUpBy} required>
              <SelectTrigger id="picked-up-by">
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
            <Label htmlFor="confirmation-code">Kod za potvrdu (6 karaktera) *</Label>
            <Input
              id="confirmation-code"
              type="text"
              maxLength={6}
              value={confirmationCode}
              onChange={(e) => handleCodeChange(e.target.value.toUpperCase())}
              placeholder="ABC123"
              className="font-mono"
              required
            />
            {codeError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{codeError}</AlertDescription>
              </Alert>
            )}
            {isCodeValid && !codeError && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Kod je validan. Preuzimanje će biti automatski potvrđeno.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup-notes">Napomena</Label>
            <Textarea id="pickup-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Otkaži
            </Button>
            <Button type="submit" disabled={!!codeError}>
              Potvrdi Preuzimanje
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
