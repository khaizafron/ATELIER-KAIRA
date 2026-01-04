"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartPopupProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
}

export function CartPopup({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartPopupProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300,
              mass: 0.8
            }}
            className="fixed right-0 top-0 z-[101] h-full w-full max-w-md"
          >
            <div className="h-full overflow-hidden rounded-l-3xl border-l border-white/20 bg-white/80 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/80">
              <div className="flex h-full flex-col">
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center justify-between border-b border-black/10 p-6 dark:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2"
                    >
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white">
                        Shopping Cart
                      </h2>
                      <p className="text-sm text-black/60 dark:text-white/60">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="rounded-full p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <X className="h-5 w-5 text-black dark:text-white" />
                  </motion.button>
                </motion.div>

                <div className="flex-1 overflow-y-auto p-6">
                  {items.length === 0 ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex h-full flex-col items-center justify-center gap-4 text-center"
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 p-6"
                      >
                        <ShoppingBag className="h-12 w-12 text-black/40 dark:text-white/40" />
                      </motion.div>
                      <div>
                        <p className="text-lg font-medium text-black dark:text-white">
                          Your cart is empty
                        </p>
                        <p className="text-sm text-black/60 dark:text-white/60">
                          Add items to get started
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ x: 50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -50, opacity: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white/50 p-4 backdrop-blur-xl transition-all hover:border-black/20 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10"
                        >
                          <div className="flex gap-4">
                            <motion.div 
                              whileHover={{ scale: 1.05 }}
                              className="relative h-20 w-20 overflow-hidden rounded-xl bg-black/5 dark:bg-white/5"
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </motion.div>
                            
                            <div className="flex flex-1 flex-col justify-between">
                              <div>
                                <h3 className="font-medium text-black dark:text-white">
                                  {item.name}
                                </h3>
                                <p className="text-sm font-semibold text-violet-600 dark:text-violet-400">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/50 p-1 dark:border-white/10 dark:bg-white/5">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                    className="rounded-full p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </motion.button>
                                  
                                  <span className="w-8 text-center text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="rounded-full p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </motion.button>
                                </div>
                                
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => onRemoveItem(item.id)}
                                  className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {items.length > 0 && (
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="border-t border-black/10 p-6 dark:border-white/10"
                  >
                    <div className="space-y-3 rounded-2xl bg-white/50 p-4 backdrop-blur-xl dark:bg-white/5">
                      <div className="flex justify-between text-sm">
                        <span className="text-black/70 dark:text-white/70">Subtotal</span>
                        <span className="font-medium text-black dark:text-white">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-black/70 dark:text-white/70">Tax (10%)</span>
                        <span className="font-medium text-black dark:text-white">
                          ${tax.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-black/20 to-transparent dark:via-white/20" />
                      <div className="flex justify-between">
                        <span className="font-semibold text-black dark:text-white">Total</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "mt-4 w-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl",
                        "relative overflow-hidden"
                      )}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10">Checkout</span>
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
