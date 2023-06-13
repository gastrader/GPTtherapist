/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"
import {  Check, ChevronsUpDown } from "lucide-react"
import { Button } from "../ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../ui/command"

import { Input } from "../ui/input"
import { cn } from "../../lib/utils"
import { toast } from "../ui/use-toast"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { api } from "~/utils/api"

const gender = [
    { label: "Male", value: "ma" },
    { label: "Female", value: "fe" },
    { label: "Transgender", value: "tr" },
    { label: "Gender Neutral", value: "gn" },
    { label: "Non-Binary", value: "nb" },
    { label: "Pangender", value: "pg" },
    { label: "Agender", value: "ag" },
    { label: "Two-Spirit", value: "ts" },
    { label: "Other/Prefer to not specify", value: "xx" },
] as const


const accountFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 30 characters.",
        }),
    age: z
        .string()
        .refine((value) => /^\d+$/.test(value), {
            message: "Age must be a valid number.",
            })
        .transform((value) => parseInt(value, 10)),
    gender: z.string({
        required_error: "Please select a gender.",
    })
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function ProfileForm() {
    const queryResult = api.profilequeryRouter.queryName.useQuery(undefined, {waitFor: 'all'});

    // This can come from your database or API.
    const defaultValues: Partial<AccountFormValues> = {
        name: queryResult?.data?.name || "Your Name",
        age: queryResult?.data?.age as number || undefined,
        gender: queryResult?.data?.gender as string || "Male",
    }

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(accountFormSchema),
        defaultValues,
    })

    const updateName = api.profile.updateName.useMutation({
        onSuccess(data){
            console.log("mutation finished: ", data)
        }
    });

    function onSubmit(data: AccountFormValues) {
        console.log("we are in submit function", data)
        updateName.mutate({ 
            name:data.name,
            age:data.age,
            gender:data.gender
        })
    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name that will be displayed on your profile and in
                                emails.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Your age"
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Only update the form field value if it's a valid number
                                        if (/^\d*$/.test(value)) {
                                            field.onChange(value);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                This is how old you are today.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Gender</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                            "w-[200px] justify-between",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value
                                            ? gender.find(
                                                (gender) => gender.value === field.value
                                            )?.label
                                            : "Select gender"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search gender..." />
                                    <CommandEmpty>No gender found.</CommandEmpty>
                                    <CommandGroup>
                                        {gender.map((gender) => (
                                            <CommandItem
                                                value={gender.value}
                                                key={gender.value}
                                                onSelect={(value) => {
                                                    form.setValue("gender", value)
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        gender.value === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {gender.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <FormDescription>
                            This is the gender that will be used for your profile.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" onClick={() => {
                toast({
                    title: "You submitted the following values:",
                })
            }}>Update account</Button>
            </form>
        </Form>
    )
}