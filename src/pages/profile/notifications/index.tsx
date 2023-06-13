import { Separator } from '~/component/ui/separator';
import SettingsLayout from '../../../component/profile/settingsLayout';
import { NotificationForm } from '../../../component/profile/notification_form';

export default function ProfilePage() {
    return (
        <SettingsLayout>
            <div>
                <div>
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <p className="text-sm text-muted-foreground pb-6">
                        Configure how you receieve notifications.
                    </p>
                </div>
                <Separator />
                <NotificationForm />
            </div>
        </SettingsLayout>
    );
}