"use client";

import React, { useState } from "react";
import { useFloating, offset, shift } from "@floating-ui/react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomTooltip({ children, content }) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom",            // 🔥 SOLO ABAJO
    middleware: [
      offset(10),                   // separación del icono
      shift({ padding: 8 }),        // evita salirse por los lados
      // ❌ flip eliminado — ya NO puede subir
    ],
  });

  return (
    <div
      ref={refs.setReference}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative inline-flex"
    >
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              top: floatingStyles.top + 40, // 🔥 fuerza que el tooltip BAJE siempre
            }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="
              z-[9999]
              px-2 py-1
              text-sm
              rounded-md
              shadow-lg
              whitespace-nowrap
              bg-black text-white
              dark:bg-gray-100 dark:text-black     /* 🌙 MODO OSCURO */
            "
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
