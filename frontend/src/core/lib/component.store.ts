// ===================
// © AngelaMos | 2025
// component.store.ts
// ===================

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/config'

interface ComponentState {
  searchQuery: string
  sidebarOpen: boolean
  tocDrawerOpen: boolean
  expandedNavSections: string[]
  versionDropdownOpen: boolean
}

interface ComponentActions {
  setSearchQuery: (query: string) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTocDrawerOpen: (open: boolean) => void
  toggleTocDrawer: () => void
  toggleNavSection: (section: string) => void
  setNavSectionExpanded: (section: string, expanded: boolean) => void
  setVersionDropdownOpen: (open: boolean) => void
  toggleVersionDropdown: () => void
}

type ComponentStore = ComponentState & ComponentActions

export const useComponentStore = create<ComponentStore>()(
  devtools(
    persist(
      (set) => ({
        searchQuery: '',
        sidebarOpen: false,
        tocDrawerOpen: false,
        expandedNavSections: [],
        versionDropdownOpen: false,

        setSearchQuery: (query) =>
          set(
            { searchQuery: query },
            false,
            'component/setSearchQuery'
          ),

        setSidebarOpen: (open) =>
          set(
            { sidebarOpen: open },
            false,
            'component/setSidebarOpen'
          ),

        toggleSidebar: () =>
          set(
            (state) => ({ sidebarOpen: !state.sidebarOpen }),
            false,
            'component/toggleSidebar'
          ),

        setTocDrawerOpen: (open) =>
          set(
            { tocDrawerOpen: open },
            false,
            'component/setTocDrawerOpen'
          ),

        toggleTocDrawer: () =>
          set(
            (state) => ({ tocDrawerOpen: !state.tocDrawerOpen }),
            false,
            'component/toggleTocDrawer'
          ),

        toggleNavSection: (section) =>
          set(
            (state) => {
              const isExpanded =
                state.expandedNavSections.includes(section)
              return {
                expandedNavSections: isExpanded
                  ? state.expandedNavSections.filter(
                      (s) => s !== section
                    )
                  : [...state.expandedNavSections, section],
              }
            },
            false,
            'component/toggleNavSection'
          ),

        setNavSectionExpanded: (section, expanded) =>
          set(
            (state) => {
              const isCurrentlyExpanded =
                state.expandedNavSections.includes(section)
              if (expanded && !isCurrentlyExpanded) {
                return {
                  expandedNavSections: [
                    ...state.expandedNavSections,
                    section,
                  ],
                }
              }
              if (!expanded && isCurrentlyExpanded) {
                return {
                  expandedNavSections:
                    state.expandedNavSections.filter(
                      (s) => s !== section
                    ),
                }
              }
              return state
            },
            false,
            'component/setNavSectionExpanded'
          ),

        setVersionDropdownOpen: (open) =>
          set(
            { versionDropdownOpen: open },
            false,
            'component/setVersionDropdownOpen'
          ),

        toggleVersionDropdown: () =>
          set(
            (state) => ({
              versionDropdownOpen: !state.versionDropdownOpen,
            }),
            false,
            'component/toggleVersionDropdown'
          ),
      }),
      {
        name: STORAGE_KEYS.UI,
      }
    ),
    { name: 'ComponentStore' }
  )
)

export const useSearchQuery = (): string =>
  useComponentStore((s) => s.searchQuery)
export const useSetSearchQuery = (): ((query: string) => void) =>
  useComponentStore((s) => s.setSearchQuery)

export const useSidebarOpen = (): boolean =>
  useComponentStore((s) => s.sidebarOpen)
export const useSetSidebarOpen = (): ((open: boolean) => void) =>
  useComponentStore((s) => s.setSidebarOpen)
export const useToggleSidebar = (): (() => void) =>
  useComponentStore((s) => s.toggleSidebar)

export const useTocDrawerOpen = (): boolean =>
  useComponentStore((s) => s.tocDrawerOpen)
export const useSetTocDrawerOpen = (): ((open: boolean) => void) =>
  useComponentStore((s) => s.setTocDrawerOpen)
export const useToggleTocDrawer = (): (() => void) =>
  useComponentStore((s) => s.toggleTocDrawer)

export const useExpandedNavSections = (): string[] =>
  useComponentStore((s) => s.expandedNavSections)
export const useToggleNavSection = (): ((section: string) => void) =>
  useComponentStore((s) => s.toggleNavSection)
export const useIsNavSectionExpanded = (section: string): boolean =>
  useComponentStore((s) => s.expandedNavSections.includes(section))

export const useVersionDropdownOpen = (): boolean =>
  useComponentStore((s) => s.versionDropdownOpen)
export const useSetVersionDropdownOpen = (): ((
  open: boolean
) => void) => useComponentStore((s) => s.setVersionDropdownOpen)
export const useToggleVersionDropdown = (): (() => void) =>
  useComponentStore((s) => s.toggleVersionDropdown)
