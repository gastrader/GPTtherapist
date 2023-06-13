"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "../../lib/utils";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { api } from "~/utils/api";
import { useState } from "react";

const accountFormSchema = z.object({
  type: z.string({
    required_error: "Please select a type to retrieve.",
  }),
  date: z.date({
    required_error: "Please select a date to retrieve the transcript.",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const [submittedValues, setSubmittedValues] = useState<
    AccountFormValues | undefined
  >();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
  });

  const { data, isLoading } = api.chatqueryRouter.queryChat.useQuery(
    // @ts-expect-error The query isn't enabled if submittedValues is undefined, so the query input should always exist
    submittedValues,
    {
      enabled: typeof submittedValues !== "undefined",
      queryKey: ["transcripts", submittedValues?.date, submittedValues?.type],
    }
  );

  console.log({ data, isLoading });

  function onSubmit(data: AccountFormValues) {
    console.log("we are in submit function", data);
    setSubmittedValues(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, console.log)}
        className="space-y-8 pt-6"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of transcript to retrieve" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="chat">Chat Logs</SelectItem>
                  <SelectItem value="video">Video Transcript</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Do you want to retrieve a video transcript or chat transcript?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The date of the transcript to retrieve.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Get Transcript</Button>
      </form>
    </Form>
  );
}
