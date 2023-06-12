import SettingsLayout from '../../../component/profile/settingsLayout';

export default function ProfilePage() {
    return (
        <SettingsLayout>
            <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                    This is the noti.
                </p>
            </div>
        </SettingsLayout>
    );
}