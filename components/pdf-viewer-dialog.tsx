"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"

interface PdfViewerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pdfUrl: string
  title: string
}

export function PdfViewerDialog({ open, onOpenChange, pdfUrl, title }: PdfViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] h-[90vh] overflow-hidden resize p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={pdfUrl} download={title} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Preuzmi
                </a>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 h-full w-full overflow-hidden">
          <object data={pdfUrl} type="application/pdf" className="w-full h-full" aria-label={title}>
            <embed src={pdfUrl} type="application/pdf" className="w-full h-full" />
          </object>
        </div>
      </DialogContent>
    </Dialog>
  )
}
