import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const COMMON_ICONS = [
  'MessageCircle',
  'MessageSquare', 
  'Mail',
  'Phone',
  'Send',
  'Headphones',
  'HelpCircle',
  'Info',
  'Sparkles',
  'Zap',
  'Heart',
  'Star',
  'Bot',
  'User',
  'Settings',
  'Hotel',
  'Bed',
  'UtensilsCrossed',
  'Coffee',
  'Wifi',
  'Car',
  'Dumbbell',
  'Waves',
  'Plane',
  'Calendar',
  'Clock',
  'MapPin',
  'Shield',
  'CreditCard'
];

const IconPicker = ({ value, onChange }: IconPickerProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className="flex items-center gap-2">
            <Icon name={value} size={16} />
            <span>{value}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {COMMON_ICONS.map((iconName) => (
          <SelectItem key={iconName} value={iconName}>
            <div className="flex items-center gap-2">
              <Icon name={iconName} size={16} />
              <span>{iconName}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default IconPicker;