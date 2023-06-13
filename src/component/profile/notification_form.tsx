/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "../ui/form"
import { api } from "~/utils/api"
import { useEffect } from "react"

const notificationsFormSchema = z.object({
    communication_emails: z.boolean().default(false).optional(),
    marketing_emails: z.boolean().default(false).optional(),
    security_emails: z.boolean().default(true),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>


export function NotificationForm() {

    const form = useForm<NotificationsFormValues>({
        resolver: zodResolver(notificationsFormSchema),
    })
    
    const updateNotifications = api.notificationUpdate.notificationUpdate.useMutation({
        onSuccess(data: any) {
            console.log("mutation finished: ", data)
        }
    });
    
    //This is running on every time the component is mounted or something?
    const notificationQuery = api.notificationequeryRouter.notiQuery.useQuery();

    useEffect(() => {
        if (notificationQuery.isSuccess) {
            const data = notificationQuery.data;
            form.setValue("communication_emails", data?.communication_emails as boolean);
            form.setValue("marketing_emails", data?.marketing_emails as boolean);
            form.setValue("security_emails", true )
        }
    }, [notificationQuery.isSuccess, notificationQuery.data, form]);
    //THIS ONLY WORKS WHEN THE DEPENDANCY ARRAY IS EMPTY NVM IDK

    function onSubmit(data: NotificationsFormValues) {
        console.log("we are in submit function", data)
        updateNotifications.mutate({
            comms: data.communication_emails ?? false,
            marketing: data.marketing_emails ?? false
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-6">
                
                <div>
                    <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="communication_emails"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Communication emails
                                        </FormLabel>
                                        <FormDescription>
                                            Receive emails about your account activity.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="marketing_emails"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Marketing emails
                                        </FormLabel>
                                        <FormDescription>
                                            Receive emails about new products, features, and more.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="security_emails"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Security emails</FormLabel>
                                        <FormDescription>
                                            Receive emails about your account activity and security.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled
                                            aria-readonly
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Button type="submit">Update notifications</Button>
            </form>
        </Form>
    )
}