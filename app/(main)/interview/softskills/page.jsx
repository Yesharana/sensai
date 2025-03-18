"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CoursesPage() {
  // Hardcoded course data
  const courses = [
    {
      title: "Improve English",
      platform: "YouTube",
      description: "How to improve english speaking for interview",
      link: "https://youtu.be/icudf_w_pqU?si=YZIn-UOS4-KojkbF",
    },
    {
      title: "Behaviour Question",
      platform: "YouTube",
      description: "Top HR Interview Questions with best answer",
      link: "https://youtu.be/HlCVG1nk_m4?si=7idelGmfRGZh2bdT",
    },
    {
      title: "PRO TIPS",
      platform: "YouTube",
      description: "5 tips to crack job interviews",
      link: "https://youtu.be/jzCSvpX19wQ?si=PmFpmiTSoZutI9Wl",
    },
    {
      title: "HR Questions",
      platform: "YouTube",
      description: "Top 20 HR Interview Questions and Answers",
      link: "https://youtu.be/BoZpcibb-JI?si=xGjo93Outtq2PZID",
    },
    {
      title: "Soft Skills",
      platform: "YouTube",
      description: "Soft Skills Interview Questions and Answers",
      link: "https://youtu.be/DE-NCqJVVnk?si=GcBWt__rS2lNG8ZX",
    },
    {
      title: "Introduction to Soft Skills",
      platform: "YouTube",
      description: "Introduction to Soft Skills Basics and interview Questions",
      link: "https://youtu.be/GtSTE3zGHjQ?si=utu41SCdxTjSWndU",
    },
    {
      title: "How to introduce yourself in the interview?",
      platform: "YouTube",
      description:"This interview Tips and Career Advice by Simplilearn is a one-stop solution to allyour career-related videos.",
      link: "https://youtube.com/playlist?list=PLEiEAq2VkUUK56bAwcQTjwwN0PRs6zBb1&si=xKOuxYtGPBiKs7Bv",
    },
    {
      title: "What are Soft Skills",
      platform: "YouTube",
      description: "Are Soft Skills important to ace an interview? Why do we need Soft Skills while buiulding a career?",
      link: "https://youtu.be/GtSTE3zGHjQ?si=utu41SCdxTjSWndU",
    },
    {
      title: "Enhancing soft skillsand personality",
      platform: "YouTube",
      description: "NPTEL Enhancing soft skills and personality",
      link: "https://youtu.be/GtSTE3zGHjQ?si=utu41SCdxTjSWndU",
    },
    {
      title: "Soft Skills in the Software Industry",
      platform: "YouTube",
      description: "We all have heard about the importance of techincal skills to land jobs. It is time to learn more about the soft skills ",
      link: "https://youtu.be/ztw2g9bpR3w?si=56nh1L7WNQWQellv",
    },
    

  ];

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
               Learning Courses
              </CardTitle>
              <CardDescription>
                Explore a variety of non-technical courses to enhance the skills.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course, index) => (
              <Card key={index} className="p-4">
                <CardHeader>
                  <CardTitle className="gradient-title text-xl">
                    {course.title}
                  </CardTitle>
                  <CardDescription>{course.platform}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {course.description}
                  </p>
                  <Button
                    className="mt-3 w-full"
                    onClick={() => window.open(course.link, "_blank")}
                  >
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
