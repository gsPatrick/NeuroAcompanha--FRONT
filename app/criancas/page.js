import ChildrenTemplate from '@/components/ui/templates/ChildrenTemplate/ChildrenTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Crianças · ${APP_NAME}` };

export default function ChildrenPage() {
  return <ChildrenTemplate />;
}
