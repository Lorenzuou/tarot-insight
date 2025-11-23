import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StageDefinition } from "@/lib/tarotStages";

interface StageReflectionDialogProps {
  open: boolean;
  stage: StageDefinition | null;
  defaultValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
  onOpenChange: (open: boolean) => void;
}

const stageColorClasses: Record<StageDefinition["color"], string> = {
  primary: "text-primary",
  accent: "text-accent",
  secondary: "text-secondary",
};

export const StageReflectionDialog = ({ open, stage, defaultValues, onSubmit, onOpenChange }: StageReflectionDialogProps) => {
  const questions = useMemo(() => stage?.questions ?? [], [stage]);

  const schema = useMemo(() => {
    const shape = questions.reduce<Record<string, z.ZodString>>((acc, question) => {
      acc[question.id] = z
        .string()
        .min(question.minLength ?? 8, "Compartilhe um pouco mais para seguirmos o ritual.")
        .max(800, "Vamos manter em até 800 caracteres para focar na essência.");
      return acc;
    }, {});
    return z.object(shape);
  }, [questions]);

  type StageFormValues = z.infer<typeof schema>;

  const buildDefaultValues = useCallback(() => {
    const values: Record<string, string> = {};
    questions.forEach((question) => {
      values[question.id] = defaultValues?.[question.id] ?? "";
    });
    return values as StageFormValues;
  }, [questions, defaultValues]);

  const form = useForm<StageFormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaultValues(),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(buildDefaultValues());
  }, [buildDefaultValues, form]);

  const colorClass = stage ? stageColorClasses[stage.color] : stageColorClasses.primary;

  const handleSubmit = async (values: StageFormValues) => {
    await onSubmit(values);
  };

  if (!stage) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl border border-primary/30 bg-gradient-to-br from-background/95 via-background/90 to-background/95 shadow-[0_0_60px_hsl(var(--primary)/0.35)]">
        <DialogHeader className="space-y-2 text-center">
          <DialogTitle className={cn("text-2xl font-bold tracking-wide", colorClass)}>
            {stage.title}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            {stage.subtitle}
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-border/40 bg-card/60 p-6 text-left"
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            {stage.description}
          </p>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {stage.questions.map((question) => (
              <FormField
                key={question.id}
                control={form.control}
                name={question.id as keyof StageFormValues}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/80">
                      {question.title}
                    </FormLabel>
                    <div className="space-y-2">
                      <p className="text-sm text-foreground/90">{question.prompt}</p>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder={question.placeholder}
                          className="min-h-[120px] resize-none bg-background/80 text-base"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter className="pt-2">
              <Button type="submit" className="bg-gradient-to-r from-primary to-accent text-lg px-8">
                Guardar Reflexões
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StageReflectionDialog;
