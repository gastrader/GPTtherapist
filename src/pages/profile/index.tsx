import SettingsLayout from '../../component/profile/settingsLayout';
import { ProfileForm } from '../../component/profile/profile_form';
import { Separator } from '~/component/ui/separator';

export default function ProfilePage() {
    return (
        <SettingsLayout>
            <div>
                <div>
                    <h3 className="text-lg font-medium">Profile</h3>
                    <p className="text-sm text-muted-foreground pb-6">
                        This is your Profile.
                    </p>
                </div>
                <Separator />
                <ProfileForm />
            </div>

        </SettingsLayout>
    );
}