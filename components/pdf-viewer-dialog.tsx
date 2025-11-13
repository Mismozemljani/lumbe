"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PdfViewerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pdfUrl: string
  title: string
}

export function PdfViewerDialog({ open, onOpenChange, pdfUrl, title }: PdfViewerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] h-[95vh]" showCloseButton={true}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            <Button variant="outline" size="sm" asChild>
              <a href={pdfUrl} download={title} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Preuzmi
              </a>
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 w-full h-full overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full border-0"
            title={title}
            sandbox="allow-same-origin allow-scripts allow-downloads"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
