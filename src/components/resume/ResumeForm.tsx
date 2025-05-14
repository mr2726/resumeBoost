// @ts-nocheck
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ResumeFormSchema, type ResumeFormValues } from "@/lib/types";
import { useResume } from "@/contexts/ResumeContext";
import { useRouter } from "next/navigation";
import { handleGenerateResume } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ResumeForm() {
  const { setResumeData, setIsLoading: setGlobalLoading, setError: setGlobalError } = useResume();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(ResumeFormSchema),
    defaultValues: {
      jobDescription: "",
      selfDescription: "",
    },
  });

  const {formState: {isSubmitting}} = form;

  async function onSubmit(values: ResumeFormValues) {
    setGlobalLoading(true);
    setGlobalError(null);
    setResumeData(null);

    const result = await handleGenerateResume(values);

    setGlobalLoading(false);
    if (result.error || !result.data) {
      const errorMessage = result.error || "Failed to generate resume. Please try again.";
      setGlobalError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      setResumeData(result.data);
      toast({
        title: "Success!",
        description: "Your resume has been generated.",
      });
      router.push("/preview");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">Job Vacancy Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Paste the full job description here for best results (min 50, max 2000 characters)."
                  className="min-h-[150px] rounded-lg border-input focus:border-accent focus:ring-accent"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="selfDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold">About Me / Self-Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a bit about yourself, your key strengths, and career goals (min 20, max 500 characters)."
                  className="min-h-[100px] rounded-lg border-input focus:border-accent focus:ring-accent"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full md:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Resume"
          )}
        </Button>
      </form>
    </Form>
  );
}
