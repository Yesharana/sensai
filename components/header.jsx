import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon , Pen } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { checkUser } from '@/lib/checkUser';

const Header =async() => {
  await checkUser();

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-60">
      <nav className='h-16 flex items-center justify-between'>
        <Link href="/" className="ml-4">
          <Image src="/logo.png" alt="Sensai Logo" width={200} height={60} className="h-12 py-1 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-2">
          <SignedIn>
            <Link href={'/dashboard'}>
              <Button variant="outline">
                <LayoutDashboard className="h-4 w-4" />
                <span className='hidden md:block'>Industry Insights</span>
              </Button>
            </Link>
          

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <StarsIcon className="h-4 w-4" />
                <span className='hidden md:block'>Growth Tools</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={"/resume"} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Build Resume</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/ai-cover-letter"} className="flex items-center gap-2">
                  <PenBox className="h-4 w-4" />
                  <span>Cover Letter</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/interview"} className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>Interview Preparation</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/notes/view"} className="flex items-center gap-2">
                <Pen className="h-4 w-4 text-black dark:text-white" /> <span>Collections</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          </SignedIn>
          <SignedOut>
          <SignInButton>
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",

                },
              }}
              afterSignOutUrl='/'
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;