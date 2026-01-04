'use client'

import { useRef } from "react"
import { Download } from "lucide-react"

type DashboardClientProps = {
  children: React.ReactNode
}

export default function DashboardClient({ children }: DashboardClientProps) {
  const dashboardRef = useRef<HTMLDivElement>(null)

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current) return

    try {
      const jsPDFModule = await import('jspdf')
      const html2canvasModule = await import('html2canvas')

      const pdf = new jsPDFModule.default('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const clonedElement = dashboardRef.current.cloneNode(true) as HTMLElement
      const allElements = clonedElement.querySelectorAll('*')
      
      allElements.forEach((el) => {
        const element = el as HTMLElement
        const computed = window.getComputedStyle(element)
        
        // Handle background-image gradients with oklch/oklab
        const bgImage = computed.getPropertyValue('background-image')
        if (bgImage && (bgImage.includes('oklch') || bgImage.includes('oklab'))) {
          // Replace with a safe RGB gradient
          element.style.backgroundImage = 'linear-gradient(to right, rgb(147, 51, 234), rgb(236, 72, 153))'
        }
        
        // Convert any oklch/oklab colors in computed styles to RGB
        const colorProperties = ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke']
        colorProperties.forEach(prop => {
          const value = computed.getPropertyValue(prop)
          if (value && (value.includes('oklch') || value.includes('oklab'))) {
            // Create a temporary element to convert the color
            const temp = document.createElement('div')
            temp.style.color = value
            document.body.appendChild(temp)
            const rgb = window.getComputedStyle(temp).color
            document.body.removeChild(temp)
            element.style.setProperty(prop, rgb)
          }
        })
        
        // Also handle class-based colors
        const colorMap: Record<string, string> = {
          'text-purple-600': 'rgb(147, 51, 234)',
          'text-blue-600': 'rgb(37, 99, 235)',
          'text-green-600': 'rgb(22, 163, 74)',
          'text-orange-600': 'rgb(234, 88, 12)',
          'text-emerald-600': 'rgb(5, 150, 105)',
          'bg-purple-100': 'rgb(243, 232, 255)',
          'bg-blue-100': 'rgb(219, 234, 254)',
          'bg-green-100': 'rgb(220, 252, 231)',
          'bg-orange-100': 'rgb(255, 237, 213)',
          'bg-emerald-100': 'rgb(209, 250, 229)',
        }
        
        element.classList.forEach((className) => {
          if (colorMap[className]) {
            if (className.startsWith('text-')) {
              element.style.color = colorMap[className]
            } else if (className.startsWith('bg-')) {
              element.style.backgroundColor = colorMap[className]
            }
          }
        })
      })

      document.body.appendChild(clonedElement)
      clonedElement.style.position = 'absolute'
      clonedElement.style.left = '-9999px'

      const canvas = await html2canvasModule.default(clonedElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      document.body.removeChild(clonedElement)

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = pdfWidth - 20
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 10

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight - 20

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight - 20
      }

      pdf.save(`Dashboard_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF')
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-black/90">Dashboard</h1>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>
      
      <div ref={dashboardRef} className="bg-white p-8 rounded-2xl">
        {children}
      </div>
    </div>
  )
}