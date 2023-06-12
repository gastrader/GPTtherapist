import { AccountForm } from '../../../component/profile/account_form';
import SettingsLayout from '../../../component/profile/settingsLayout';

export default function ProfilePage() {
    return (
        <SettingsLayout>
            <div>
                <h3 className="text-lg font-medium">Account</h3>
                <p className="text-sm text-muted-foreground">
                    <AccountForm/>
                </p>
            </div>
        </SettingsLayout>
    );
}