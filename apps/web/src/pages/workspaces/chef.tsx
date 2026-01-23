/**
 * M8.1: Chef Workspace (Kitchen)
 */
import { WorkspacePlaceholder } from '@/components/workspace/WorkspacePlaceholder';

export default function ChefWorkspace() {
  return (
    <WorkspacePlaceholder
      expectedRole="CHEF"
      customLinks={[
        { label: 'Kitchen Display', href: '/kds', description: 'View incoming orders' },
        { label: 'Recipes', href: '/inventory/recipes', description: 'Recipe and prep info' },
        { label: 'Inventory', href: '/inventory', description: 'Check ingredient stock' },
        { label: 'Waste Log', href: '/inventory/waste', description: 'Record kitchen waste' },
      ]}
    />
  );
}
