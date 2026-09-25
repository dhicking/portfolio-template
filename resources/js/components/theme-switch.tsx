import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';

const options: { value: Appearance; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'Auto' },
];

export default function ThemeSwitch() {
    const { appearance, updateAppearance } = useAppearance();

    return (
        <ToggleGroup
            type="single"
            value={appearance}
            onValueChange={(value) =>
                value && updateAppearance(value as Appearance)
            }
            aria-label="Colour scheme"
            className="gap-3"
        >
            {options.map((option) => (
                <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    className="h-auto min-w-0 px-0 caption hover:bg-transparent hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:text-foreground data-[state=on]:underline data-[state=on]:decoration-signal data-[state=on]:underline-offset-4"
                >
                    {option.label}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}
