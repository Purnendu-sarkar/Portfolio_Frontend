"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  showClose?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  showClose = true,
}: ModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className={`rounded-2xl border shadow-xl bg-background ${sizeClasses[size]}`}
          >
            {/* Animate entire modal entry */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div>
                    {title && (
                      <DialogTitle className="text-2xl font-semibold mb-1">
                        {title}
                      </DialogTitle>
                    )}
                    {description && (
                      <DialogDescription className="text-sm text-muted-foreground">
                        {description}
                      </DialogDescription>
                    )}
                  </div>
                  {showClose && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-transparent"
                      onClick={() => onOpenChange(false)}
                    >
                      <X className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </DialogHeader>

              {/* Animate inner content */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.1 }}
                className="mt-3 space-y-4"
              >
                {children}
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default Modal;
