'use client'

import { GlassCard } from "@/components/glass"
import { Eye, MessageCircle, TrendingUp, Download, Printer, ArrowLeft, FileText, PieChart, DollarSign, Package, ShoppingCart, TrendingDown } from "lucide-react"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { useReactToPrint } from 'react-to-print'
import { useRouter } from "next/navigation"

type ItemStat = {
  id: string
  title: string
  slug: string
  price: number
  status: string
  viewCount: number
  clickCount: number
}

type ReportClientProps = {
  itemStats: ItemStat[]
  totalViews: number
  totalClicks: number
  conversionRate: number
  totalRevenue: number
  soldItemsCount: number
  availableItemsCount: number
  inventoryValue: number
  avgItemPrice: number
  avgSalePrice: number
  dateRangeLabel: string
  currentRange: string
}

export default function ReportClient({
  itemStats,
  totalViews,
  totalClicks,
  conversionRate,
  totalRevenue,
  soldItemsCount,
  availableItemsCount,
  inventoryValue,
  avgItemPrice,
  avgSalePrice,
  dateRangeLabel,
  currentRange
}: ReportClientProps) {
  const reportRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [generatedDate, setGeneratedDate] = useState<string>('')

  useEffect(() => {
    setGeneratedDate(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }))
  }, [])

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `Analytics_Report_${dateRangeLabel}_${new Date().toISOString().split('T')[0]}`,
    onBeforePrint: () => {
      const originalConsoleError = console.error
      console.error = (...args: any[]) => {
        if (args[0]?.includes?.('react-to-print') || args[0]?.includes?.('Failed to load')) {
          return
        }
        originalConsoleError(...args)
      }
      return Promise.resolve()
    },
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
        .page-break {
          page-break-before: always;
        }
      }
    `,
  })

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return

    try {
      const jsPDFModule = await import('jspdf')
      const html2canvasModule = await import('html2canvas')

      const pdf = new jsPDFModule.default('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      const canvas = await html2canvasModule.default(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-report-content]') as HTMLElement
          if (clonedElement) {
            clonedElement.style.background = '#ffffff'
            
            const allElements = clonedElement.querySelectorAll('*')
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement
              
              const colorMap: Record<string, string> = {
                'text-purple-600': 'rgb(147, 51, 234)',
                'text-purple-900': 'rgb(88, 28, 135)',
                'text-emerald-600': 'rgb(5, 150, 105)',
                'text-emerald-900': 'rgb(6, 78, 59)',
                'text-blue-600': 'rgb(37, 99, 235)',
                'text-blue-900': 'rgb(30, 58, 138)',
                'text-pink-600': 'rgb(219, 39, 119)',
                'text-pink-900': 'rgb(131, 24, 67)',
                'text-green-600': 'rgb(22, 163, 74)',
                'text-green-800': 'rgb(22, 101, 52)',
                'text-green-900': 'rgb(20, 83, 45)',
                'text-orange-600': 'rgb(234, 88, 12)',
                'text-orange-800': 'rgb(154, 52, 18)',
                'text-orange-900': 'rgb(124, 45, 18)',
                'text-indigo-600': 'rgb(79, 70, 229)',
                'text-indigo-900': 'rgb(49, 46, 129)',
                'text-teal-600': 'rgb(13, 148, 136)',
                'text-teal-900': 'rgb(19, 78, 74)',
                'text-yellow-800': 'rgb(133, 77, 14)',
                'text-red-800': 'rgb(153, 27, 27)',
                'bg-purple-50': 'rgb(250, 245, 255)',
                'bg-pink-50': 'rgb(253, 242, 248)',
                'bg-emerald-50': 'rgb(236, 253, 245)',
                'bg-blue-50': 'rgb(239, 246, 255)',
                'bg-green-50': 'rgb(240, 253, 244)',
                'bg-green-100': 'rgb(220, 252, 231)',
                'bg-orange-50': 'rgb(255, 247, 237)',
                'bg-orange-100': 'rgb(255, 237, 213)',
                'bg-indigo-50': 'rgb(238, 242, 255)',
                'bg-teal-50': 'rgb(240, 253, 250)',
                'bg-yellow-100': 'rgb(254, 249, 195)',
                'bg-red-100': 'rgb(254, 226, 226)',
              }
              
              htmlEl.classList.forEach((className) => {
                if (colorMap[className]) {
                  if (className.startsWith('text-')) {
                    htmlEl.style.color = colorMap[className]
                  } else if (className.startsWith('bg-')) {
                    htmlEl.style.backgroundColor = colorMap[className]
                  }
                }
              })
            })
          }
        }
      })

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
      
      pdf.save(`Analytics_Report_${dateRangeLabel}_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please use the Print button instead.')
    }
  }

  const handleDateRangeChange = (range: string) => {
    router.push(`/admin/reports/generate?range=${range}`)
  }

  return (
    <div className="min-h-screen">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/admin/reports"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-black/70 transition-colors hover:bg-black/5"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Reports
        </Link>

        <div className="flex flex-wrap gap-3">
          <select
            value={currentRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:border-purple-300 focus:border-purple-500 focus:outline-none"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-lg border border-purple-600 px-6 py-2 font-semibold text-purple-600 transition-all hover:bg-purple-50"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div ref={reportRef} data-report-content className="rounded-2xl bg-white p-12 shadow-xl">
        <div className="mb-12 border-b-4 border-purple-600 pb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-3">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black/90">Analytics Report</h1>
              <p className="text-lg text-black/60">Performance Metrics & Business Insights</p>
            </div>
          </div>
          
          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <span className="font-semibold text-black/60">Report Period:</span>
              <span className="ml-2 font-bold text-black/90">{dateRangeLabel}</span>
            </div>
            <div>
              <span className="font-semibold text-black/60">Generated:</span>
              <span className="ml-2 font-bold text-black/90">
                {generatedDate || 'Loading...'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-black/90">Executive Summary</h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border-2 border-purple-200 bg-purple-50/50 p-6">
              <div className="mb-2 flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <p className="text-sm font-semibold text-purple-900">Total Views</p>
              </div>
              <p className="text-3xl font-bold text-purple-900">{totalViews.toLocaleString()}</p>
            </div>

            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-6">
              <div className="mb-2 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-900">WhatsApp Clicks</p>
              </div>
              <p className="text-3xl font-bold text-emerald-900">{totalClicks.toLocaleString()}</p>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-6">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <p className="text-sm font-semibold text-blue-900">Conversion Rate</p>
              </div>
              <p className="text-3xl font-bold text-blue-900">{conversionRate.toFixed(1)}%</p>
            </div>

            <div className="rounded-xl border-2 border-pink-200 bg-pink-50/50 p-6">
              <div className="mb-2 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-pink-600" />
                <p className="text-sm font-semibold text-pink-900">Total Revenue</p>
              </div>
              <p className="text-3xl font-bold text-pink-900">RM {totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-black/90">Revenue & Sales Analysis</h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border-2 border-green-200 bg-green-50/50 p-6">
              <div className="mb-2 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <p className="text-sm font-semibold text-green-900">Items Sold</p>
              </div>
              <p className="text-3xl font-bold text-green-900">{soldItemsCount}</p>
            </div>

            <div className="rounded-xl border-2 border-orange-200 bg-orange-50/50 p-6">
              <div className="mb-2 flex items-center gap-2">
                <Package className="h-5 w-5 text-orange-600" />
                <p className="text-sm font-semibold text-orange-900">Available Items</p>
              </div>
              <p className="text-3xl font-bold text-orange-900">{availableItemsCount}</p>
            </div>

            <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/50 p-6">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <p className="text-sm font-semibold text-indigo-900">Avg Sale Price</p>
              </div>
              <p className="text-3xl font-bold text-indigo-900">RM {avgSalePrice.toFixed(0)}</p>
            </div>

            <div className="rounded-xl border-2 border-teal-200 bg-teal-50/50 p-6">
              <div className="mb-2 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-teal-600" />
                <p className="text-sm font-semibold text-teal-900">Inventory Value</p>
              </div>
              <p className="text-3xl font-bold text-teal-900">RM {inventoryValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="page-break mb-12">
          <h2 className="mb-6 text-2xl font-bold text-black/90">Detailed Item Performance</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black/20 bg-gradient-to-r from-purple-100 to-pink-100">
                  <th className="p-4 text-left text-sm font-bold text-black/90">Item Title</th>
                  <th className="p-4 text-left text-sm font-bold text-black/90">Price</th>
                  <th className="p-4 text-center text-sm font-bold text-black/90">Status</th>
                  <th className="p-4 text-center text-sm font-bold text-black/90">Views</th>
                  <th className="p-4 text-center text-sm font-bold text-black/90">Clicks</th>
                  <th className="p-4 text-center text-sm font-bold text-black/90">CTR</th>
                </tr>
              </thead>
              <tbody>
                {itemStats.map((item, index) => {
                  const viewCount = item.viewCount || 0
                  const clickCount = item.clickCount || 0
                  const ctr = viewCount > 0 ? ((clickCount / viewCount) * 100).toFixed(1) : '0'
                  
                  return (
                    <tr 
                      key={item.id} 
                      className={`border-b border-black/10 ${index % 2 === 0 ? 'bg-black/5' : 'bg-white'}`}
                    >
                      <td className="p-4 font-medium text-black/90">{item.title}</td>
                      <td className="p-4 text-black/70">RM {Number(item.price).toFixed(0)}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === 'available' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4 text-center font-semibold text-black/70">{viewCount}</td>
                      <td className="p-4 text-center font-semibold text-black/70">{clickCount}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          parseFloat(ctr) > 10 
                            ? 'bg-green-100 text-green-800'
                            : parseFloat(ctr) > 5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {ctr}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-black/10 pt-8 text-center">
          <p className="text-sm text-black/50">
            This report was automatically generated on {generatedDate || 'Loading...'}
          </p>
          <p className="mt-2 text-sm font-semibold text-black/70">
            © {new Date().getFullYear()} Ximy Vault Analytics - All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  )
}