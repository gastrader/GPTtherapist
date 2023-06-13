import { Separator } from '~/component/ui/separator';
import SettingsLayout from '../../../component/profile/settingsLayout';
import { AccountForm } from '../../../component/profile/account_form';

export default function ProfilePage() {
    return (
        <SettingsLayout>
            <div>
                <div>
                    <h3 className="text-lg font-medium">Account History</h3>
                    <p className="text-sm text-muted-foreground pb-6">
                        Retrieve previous chat transcripts with your therapist by date.
                    </p>
                </div>
                <Separator />
                <AccountForm />
            </div>
        </SettingsLayout>
    );
}