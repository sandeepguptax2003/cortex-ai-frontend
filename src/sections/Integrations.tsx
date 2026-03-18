"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { StaggerContainer } from "@/components/animations/StaggerContainer";

const integrations = [
  {
    name: "Zoom",
    category: "Video Conferencing",
    description: "Capture live captions from Zoom meetings",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#2D8CFF">
        <path d="M4.585 10.473v4.517a1.044 1.044 0 001.047 1.044h5.967l4.037 3.13v-3.13h1.61a1.044 1.044 0 001.046-1.044v-4.517a1.044 1.044 0 00-1.046-1.044H5.632a1.044 1.044 0 00-1.047 1.044z" />
      </svg>
    ),
  },
  {
    name: "Google Meet",
    category: "Video Conferencing",
    description: "Extract tasks from Google Meet sessions",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#00832d">
        <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    ),
  },
  {
    name: "Microsoft Teams",
    category: "Video Conferencing",
    description: "Works seamlessly with Teams meetings",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#6264A7">
        <path d="M20.625 8.334h-5.958v8.666h5.958a2.167 2.167 0 002.167-2.167v-4.333a2.167 2.167 0 00-2.167-2.166zM15.667 4.5a2.167 2.167 0 11-4.334 0 2.167 2.167 0 014.334 0zM12.333 8.334H5.042A2.167 2.167 0 002.875 10.5v4.333a2.167 2.167 0 002.167 2.167h7.291V8.334z" />
      </svg>
    ),
  },
  {
    name: "Slack",
    category: "Communication",
    description: "Get notifications and updates in Slack",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#4A154B">
        <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z" />
      </svg>
    ),
  },
  {
    name: "Notion",
    category: "Documentation",
    description: "Sync tasks with Notion databases",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#000000">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.934zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.22.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
      </svg>
    ),
  },
  {
    name: "Jira",
    category: "Project Management",
    description: "Export tasks to Jira projects",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#0052CC">
        <path d="M11.571 11.513H0a5.218 5.218 0 005.232 5.215h2.13v2.057A5.215 5.215 0 0012.575 24V12.518a1.005 1.005 0 00-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 005.215 5.214h2.129v2.058a5.218 5.218 0 005.215 5.214V6.758a1.001 1.001 0 00-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 005.215 5.215h2.129v2.057A5.215 5.215 0 0024 12.483V1.005A1.005 1.005 0 0023.013 0z" />
      </svg>
    ),
  },
];

export function Integrations() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn direction="up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Works with your{" "}
              <span className="gradient-text">favorite tools</span>
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={100}>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Cortex AI integrates seamlessly with the tools you already use.
              Connect once, work everywhere.
            </p>
          </FadeIn>
        </div>

        {/* Integrations Grid */}
        <StaggerContainer
          staggerDelay={100}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {integration.icon}
                </div>
                <div>
                  <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">
                    {integration.category}
                  </p>
                  <h3 className="font-semibold mb-1">{integration.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {integration.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
