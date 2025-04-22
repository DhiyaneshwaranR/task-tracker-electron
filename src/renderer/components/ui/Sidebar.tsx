import React from 'react';
import { CalendarDays, HandPlatter, Gauge } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
    return (
        <aside className="h-full w-16 bg-muted border-r flex flex-col items-center py-4 space-y-4">
            <SidebarButton
                icon={<Gauge className="w-5 h-5" />}
                active={activeTab === 'dashboard'}
                onClick={() => onTabChange('dashboard')}
            />
            <SidebarButton
                icon={<CalendarDays className="w-5 h-5" />}
                active={activeTab === 'calendar'}
                onClick={() => onTabChange('calendar')}
            />
            <SidebarButton
                icon={<HandPlatter className="w-5 h-5" />}
                active={activeTab === 'meals'}
                onClick={() => onTabChange('meals')}
            />
        </aside>
    );
}

function SidebarButton({
                           icon,
                           active,
                           onClick,
                       }: {
    icon: React.ReactNode;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                'rounded-md',
                active
                    ? 'bg-gray-800 text-white hover:bg-gray-800 hover:text-white' // disable hover override
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
            onClick={onClick}
        >
            {icon}
        </Button>
    );
}