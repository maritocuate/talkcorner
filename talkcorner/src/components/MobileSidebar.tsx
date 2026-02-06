import { X } from 'lucide-react'
import UsersList from './UsersList'
import { Button } from './ui/button'

interface MobileSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
          fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background z-50
          transform transition-transform duration-300 ease-in-out md:hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Header con botón de cerrar */}
                    <div className="flex justify-end p-4 border-b">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            aria-label="Close sidebar"
                        >
                            <X size={24} />
                        </Button>
                    </div>

                    {/* Contenido del sidebar */}
                    <div className="flex-1 overflow-y-auto">
                        <UsersList />
                    </div>
                </div>
            </div>
        </>
    )
}
