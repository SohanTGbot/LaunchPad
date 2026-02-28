"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const steps = [
    {
        title: "What's your primary goal?",
        options: ["Job search", "Freelance", "Portfolio", "Other"]
    },
    {
        title: "What's your experience level?",
        options: ["Student", "0–2 years", "3–7 years", "8+ years"]
    },
    {
        title: "Select your industry",
        options: ["Tech", "Design", "Finance", "Healthcare", "Education", "Other"]
    },
    {
        title: "How would you like to start?",
        options: ["Choose a Template", "Start Blank"]
    }
];

export default function OnboardingQuiz() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});

    const handleSelect = (option: string) => {
        setAnswers(prev => ({ ...prev, [currentStep]: option }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Final step -> Save preferences and redirect
            // TODO: Save to Insforge DB
            const chosenPath = answers[3];
            if (chosenPath === "Choose a Template") {
                router.push('/templates');
            } else {
                router.push('/builder/new'); // Start blank
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-background flex flex-col pt-20 px-6">
            <div className="max-w-xl mx-auto w-full">
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden mb-12">
                    <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                </div>

                {/* Header / Nav */}
                <div className="flex items-center mb-8 h-10">
                    {currentStep > 0 && (
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    )}
                    <span className="ml-auto text-sm text-foreground/40 font-mono">
                        step {currentStep + 1} of {steps.length}
                    </span>
                </div>

                {/* Quiz Content Container */}
                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full absolute"
                        >
                            <h1 className="text-3xl md:text-4xl font-display mb-8">
                                {steps[currentStep].title}
                            </h1>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
                                {steps[currentStep].options.map((option) => {
                                    const isSelected = answers[currentStep] === option;
                                    return (
                                        <Card
                                            key={option}
                                            glass={false}
                                            className={`cursor-pointer transition-all duration-200 p-6 flex items-center justify-center text-center
                        ${isSelected
                                                    ? 'border-accent bg-accent/10 shadow-[0_0_15px_rgba(108,99,255,0.15)]'
                                                    : 'hover:border-accent/50 hover:bg-surface/80'
                                                }`}
                                            onClick={() => handleSelect(option)}
                                        >
                                            <span className={`font-medium ${isSelected ? 'text-accent' : 'text-foreground'}`}>
                                                {option}
                                            </span>
                                        </Card>
                                    );
                                })}
                            </div>

                            <div className="mt-12 flex justify-end">
                                <Button
                                    size="lg"
                                    onClick={nextStep}
                                    disabled={!answers[currentStep]}
                                    className="w-full sm:w-auto gap-2"
                                >
                                    {currentStep === steps.length - 1 ? "Finish" : "Next"} <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
