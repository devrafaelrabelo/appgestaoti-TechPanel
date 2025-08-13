"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight, Loader2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"
import { DynamicIcon } from "@/components/dynamic-icon"
import { useMenuData } from "@/hooks/use-menu-data"
import { buildFullPath, isPathActive } from "@/app/utils/menu-permissions"
import type { MenuItem, SubMenuItem } from "@/types/menu"

interface SystemSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function SystemSidebar({ isCollapsed, onToggle }: SystemSidebarProps) {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const { menuData, isLoading, error } = useMenuData()
  const router = useRouter()
  const pathname = usePathname()
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isSubMenuActive = (subItem: SubMenuItem) => {
    if (!menuData) return false
    return isPathActive(pathname, subItem.path, menuData.currentSystem)
  }

  const isMenuActive = (menuItem: MenuItem) => {
    return menuItem.submenu.some(isSubMenuActive)
  }

  const getActiveMenuTitle = () => {
    if (!menuData) return null
    for (const menu of menuData.menus) {
      if (isMenuActive(menu)) {
        return menu.title
      }
    }
    return null
  }

  useEffect(() => {
    if (!isCollapsed) {
      const activeMenu = getActiveMenuTitle()
      setExpandedMenu(activeMenu)
    }
  }, [isCollapsed, menuData, pathname])

  const handleMenuClick = (menuTitle: string) => {
    if (isCollapsed) {
      onToggle()
    } else {
      setExpandedMenu(expandedMenu === menuTitle ? null : menuTitle)
    }
  }

  const handleSubMenuClick = (subItem: SubMenuItem) => {
    if (!menuData) return
    const path = buildFullPath(menuData.currentSystem, subItem.path)
    router.push(path)
    if (window.innerWidth < 1024) {
      onToggle()
    }
  }

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  const handleMouseEnter = (menuTitle: string) => {
    if (isCollapsed) {
      clearHoverTimeout()
      setHoveredMenu(menuTitle)
    }
  }

  const handleMouseLeave = () => {
    if (isCollapsed) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredMenu(null)
      }, 150)
    }
  }

  useEffect(() => {
    if (isCollapsed) {
      setExpandedMenu(null)
    } else {
      setHoveredMenu(null)
    }
  }, [isCollapsed])

  if (isLoading) {
    return (
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border z-40 transition-all duration-300 ease-in-out flex flex-col items-center justify-center",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        {!isCollapsed && <p className="mt-2 text-sm text-muted-foreground">Carregando menu...</p>}
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border z-40 transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-4",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <AlertCircle className="h-6 w-6 text-destructive" />
        {!isCollapsed && (
          <div className="mt-2 text-sm text-muted-foreground text-center">
            <p>Erro ao carregar menu</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        )}
      </div>
    )
  }

  if (!menuData || menuData.menus.length === 0) {
    return (
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border z-40 transition-all duration-300 ease-in-out flex flex-col items-center justify-center p-4",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <AlertCircle className="h-6 w-6 text-muted-foreground" />
        {!isCollapsed && (
          <div className="mt-2 text-sm text-muted-foreground text-center">
            <p>Nenhum menu disponível</p>
            {menuData?.currentSystem && <p className="text-xs mt-1">Sistema: {menuData.currentSystem}</p>}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Overlay para fechar o menu em dispositivos móveis */}
      {!isCollapsed && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={onToggle} />}

      {/* Sidebar Principal */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background border-r border-border z-40 transition-all duration-300 ease-in-out flex flex-col",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Menu Items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {menuData.menus.map((item) => (
              <li key={item.title} onMouseEnter={() => handleMouseEnter(item.title)} onMouseLeave={handleMouseLeave}>
                <button
                  onClick={() => handleMenuClick(item.title)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200",
                    "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isMenuActive(item) && !isCollapsed && "bg-accent text-accent-foreground",
                    isMenuActive(item) && isCollapsed && "bg-primary text-primary-foreground",
                  )}
                >
                  <DynamicIcon name={item.icon} className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium flex-1 text-left">{item.title}</span>}
                  {item.submenu.length > 0 && !isCollapsed && (
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        expandedMenu === item.title && "rotate-90",
                      )}
                    />
                  )}
                </button>

                {/* Submenu expandido quando sidebar não está colapsada */}
                {!isCollapsed && expandedMenu === item.title && (
                  <ul className="mt-1 ml-4 pl-4 border-l border-border space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.label}>
                        <button
                          onClick={() => handleSubMenuClick(subItem)}
                          className={cn(
                            "w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                            "hover:bg-accent hover:text-accent-foreground",
                            isSubMenuActive(subItem) && "bg-accent text-accent-foreground font-semibold",
                          )}
                        >
                          <DynamicIcon name={subItem.icon} className="h-4 w-4" />
                          <span>{subItem.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-2 mt-auto">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground text-center">
              <p>v1.0.0</p>
              {menuData?.currentSystem && <p className="font-semibold text-primary">{menuData.currentSystem}</p>}
            </div>
          )}
        </div>
      </aside>

      {/* Menu Hover - Idêntico ao menu expandido */}
      {isCollapsed && hoveredMenu && (
        <div
          className="fixed left-16 w-64 z-50 top-16 h-[calc(100vh-4rem)]"
          onMouseEnter={clearHoverTimeout}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-background border-r border-border shadow-xl h-full flex flex-col animate-in slide-in-from-left-2 duration-150">
            {/* Menu Items - Idêntico ao menu principal */}
            <nav className="flex-1 py-4 overflow-y-auto">
              <ul className="space-y-2 px-2">
                {menuData.menus.map((item) => (
                  <li key={item.title}>
                    <button
                      onClick={() => handleMenuClick(item.title)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200",
                        "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        isMenuActive(item) && "bg-accent text-accent-foreground",
                        hoveredMenu === item.title && "bg-accent text-accent-foreground",
                      )}
                    >
                      <DynamicIcon name={item.icon} className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium flex-1 text-left">{item.title}</span>
                      {item.submenu.length > 0 && (
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            hoveredMenu === item.title && "rotate-90",
                          )}
                        />
                      )}
                    </button>

                    {/* Submenu sempre expandido para o item em hover */}
                    {hoveredMenu === item.title && item.submenu.length > 0 && (
                      <ul className="mt-1 ml-4 pl-4 border-l border-border space-y-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.label}>
                            <button
                              onClick={() => handleSubMenuClick(subItem)}
                              className={cn(
                                "w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                isSubMenuActive(subItem) && "bg-accent text-accent-foreground font-semibold",
                              )}
                            >
                              <DynamicIcon name={subItem.icon} className="h-4 w-4" />
                              <span>{subItem.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer - Idêntico ao footer principal */}
            <div className="border-t border-border p-2 mt-auto">
              <div className="text-xs text-muted-foreground text-center">
                <p>v1.0.0</p>
                {menuData?.currentSystem && <p className="font-semibold text-primary">{menuData.currentSystem}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
