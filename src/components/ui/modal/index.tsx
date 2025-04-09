"use client";
import React, { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose}></div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
