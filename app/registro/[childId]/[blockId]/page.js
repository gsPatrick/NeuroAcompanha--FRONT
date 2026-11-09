import BlockRecordTemplate from '@/components/ui/templates/BlockRecordTemplate/BlockRecordTemplate';
import { APP_NAME } from '@/constants/brand';

export const metadata = { title: `Registro · ${APP_NAME}` };

export default function BlockRecordPage() {
  return <BlockRecordTemplate />;
}
