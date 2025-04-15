import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Settings, Bell, User, Speech, Database, FileCode, AppWindow, ShieldCheck, DollarSign, X } from "lucide-react";
import { Switch } from "./ui/switch";
import { useTheme } from "~/utils/ThemeContext";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { logoutFn } from "~/functions/session";

type SettingsSectionProps = {
  children: React.ReactNode;
  title: string;
  visible: boolean;
};

const SettingsSection = ({ children, title, visible }: SettingsSectionProps) => {
  if (!visible) return null;
  
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
};

type SettingItemProps = {
  title: string;
  description?: string;
  rightElement?: React.ReactNode;
};

const SettingItem = ({ title, description, rightElement }: SettingItemProps) => {
  return (
    <div className="flex justify-between items-center py-2.5 border-t border-gray-200 dark:border-gray-700">
      <div className="pr-3">
        <h3 className="text-sm font-medium">{title}</h3>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      <div className="flex-shrink-0">
        {rightElement}
      </div>
    </div>
  );
};

export function SettingsButton({ sidebarOpen }: { sidebarOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("general");
  const { theme, toggleTheme } = useTheme();
  const { logout } = usePrivy();
  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      await logout();
      await logoutFn();
      nav({ href: "/", replace: true });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };
  
  // Create the common settings content 
  const SettingsContent = () => (
    <>
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar with options - on mobile, this becomes tabs at the top */}
        <div className="w-full md:w-1/3 md:border-r border-gray-200 dark:border-gray-700 overflow-x-auto md:overflow-y-auto scrollbar-hide md:overflow-x-hidden md:block">
          <div className="flex md:flex-col p-2 gap-1 md:gap-1 overflow-x-auto scrollbar-hide md:overflow-visible whitespace-nowrap">
            <Button
              variant={activeSection === "general" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("general")}
            >
              <Settings size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">General</span>
            </Button>
            <Button
              variant={activeSection === "notifications" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("notifications")}
            >
              <Bell size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Notifications</span>
            </Button>
            <Button
              variant={activeSection === "personalization" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("personalization")}
            >
              <User size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Personalization</span>
            </Button>
            <Button
              variant={activeSection === "speech" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("speech")}
            >
              <Speech size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Speech</span>
            </Button>
            <Button
              variant={activeSection === "data" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("data")}
            >
              <Database size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Data controls</span>
            </Button>
            <Button
              variant={activeSection === "developer" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("developer")}
            >
              <FileCode size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Builder profile</span>
            </Button>
            <Button
              variant={activeSection === "apps" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("apps")}
            >
              <AppWindow size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Connected apps</span>
            </Button>
            <Button
              variant={activeSection === "security" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("security")}
            >
              <ShieldCheck size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Security</span>
            </Button>
            <Button
              variant={activeSection === "subscription" ? "secondary" : "ghost"}
              className="md:w-full justify-start text-left px-2 py-1.5 text-sm"
              onClick={() => setActiveSection("subscription")}
            >
              <DollarSign size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">Subscription</span>
            </Button>
          </div>
        </div>
        
        {/* Right content area - takes full width on mobile */}
        <div className="hidden md:block md:w-2/3 overflow-y-auto scrollbar-hide p-4">
          <SettingsSection title="General" visible={activeSection === "general"}>
            <SettingItem 
              title="Theme" 
              rightElement={
                <Button 
                  variant="outline" 
                  onClick={toggleTheme}
                  className="min-w-20 h-8 text-sm flex justify-center"
                >
                  {theme === "light" ? "Light" : "Dark"}
                </Button>
              } 
            />
            <SettingItem 
              title="Language" 
              rightElement={
                <Button 
                  variant="outline"
                  className="min-w-20 h-8 text-sm flex justify-center"
                >
                  Auto-detect
                </Button>
              } 
            />
          </SettingsSection>
          
          <SettingsSection title="Notifications" visible={activeSection === "notifications"}>
            <SettingItem 
              title="Enable notifications" 
              description="Receive updates about your account activity"
              rightElement={<Switch size="sm" />} 
            />
          </SettingsSection>
          
          <SettingsSection title="Personalization" visible={activeSection === "personalization"}>
            <SettingItem 
              title="Always show code when using data analyst" 
              rightElement={<Switch size="sm" />} 
            />
            <SettingItem 
              title="Show follow up suggestions in chats" 
              rightElement={<Switch size="sm" defaultChecked />} 
            />
          </SettingsSection>
          
          <SettingsSection title="Data controls" visible={activeSection === "data"}>
            <SettingItem 
              title="Archived chats" 
              rightElement={
                <Button 
                  variant="outline"
                  size="sm"
                  className="min-w-20 h-8 text-sm flex justify-center"
                >
                  Manage
                </Button>
              } 
            />
            <SettingItem 
              title="Clear chat history" 
              rightElement={
                <Button 
                  variant="destructive"
                  size="sm"
                  className="min-w-20 h-8 text-sm flex justify-center"
                >
                  Clear
                </Button>
              } 
            />
          </SettingsSection>
          
          <SettingsSection title="Security" visible={activeSection === "security"}>
            <SettingItem 
              title="Sign out" 
              description="Log out of your account on this device"
              rightElement={
                <Button 
                  variant="outline"
                  onClick={handleLogout}
                  size="sm"
                  className="min-w-20 h-8 text-sm flex justify-center"
                >
                  Sign out
                </Button>
              } 
            />
          </SettingsSection>
        </div>
      </div>
    </>
  );

  // Settings button in sidebar
  const SettingsButton = (
    <div 
      className="flex items-center gap-3 rounded-md px-3 py-2 w-full text-gray-700 dark:text-gray-200 hover:bg-[#1E9BB9]/20 cursor-pointer transition-colors duration-200"
      onClick={() => setIsOpen(true)}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5"></path>
        <path d="M19.4 15C19.1277 15.8031 19.2289 16.6718 19.68 17.4L19.75 17.51C20.1294 18.0725 20.2493 18.7771 20.0852 19.4433C19.9211 20.1095 19.4883 20.676 18.89 21.01C18.2993 21.3468 17.5887 21.4426 16.9321 21.2765C16.2755 21.1104 15.7258 20.6966 15.4 20.13L15.33 20C14.9371 19.3065 14.2689 18.824 13.5 18.65C12.7369 18.8274 12.0743 19.308 11.68 20L11.61 20.09C11.2887 20.6656 10.7359 21.0845 10.0752 21.2502C9.41456 21.416 8.70052 21.3156 8.11 20.97C7.51969 20.636 7.08743 20.0695 6.92333 19.4033C6.75923 18.7371 6.87914 18.0325 7.25851 17.47L7.33 17.36C7.76962 16.6345 7.86832 15.7699 7.6 15C6.84199 14.8301 6.17546 14.3478 5.78 13.67L5.71 13.58C5.32525 13.0223 5.21467 12.3201 5.38069 11.655C5.54671 10.99 5.97979 10.4226 6.58 10.09C7.17456 9.7513 7.88484 9.6535 8.54161 9.81969C9.19838 9.98588 9.75004 10.4015 10.08 11L10.15 11.07C10.5429 11.7635 11.2111 12.246 11.98 12.42H12.02C12.7831 12.2426 13.4457 11.762 13.84 11.07L13.91 11C14.2345 10.4243 14.7823 10.0148 15.4362 9.8516C16.0901 9.68834 16.7899 9.785 17.38 10.12C17.9705 10.454 18.403 11.0205 18.5671 11.6867C18.7312 12.3529 18.6113 13.0575 18.2319 13.62L18.16 13.73C17.7204 14.4555 17.6217 15.3201 17.89 16.09L17.95 16.18C18.1721 16.8801 18.6451 17.4749 19.29 17.83C19.3233 17.8567 19.3633 17.8767 19.4 17.89" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
      </svg>
      {sidebarOpen && <span>Settings</span>}
    </div>
  );

  // Render different modal types based on screen size
  return (
    <>
      {SettingsButton}
      
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent 
            side="bottom" 
            className="w-full p-0 overflow-hidden 
            rounded-t-2xl border-t border-gray-200 dark:border-gray-700 
            bg-white dark:bg-gray-900
            shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.2)]
            transition-all duration-300 ease-in-out
            data-[state=closed]:opacity-0 data-[state=open]:opacity-100
            h-[85vh] sm:h-[85vh]"
          >
            <div className="flex h-full flex-col w-full mx-auto">
              <SheetHeader className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 relative">
                {/* Draggable handle for mobile */}
                <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
                  <div className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full -mt-3"></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </Button>
                  </SheetClose>
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-hidden">
                <SettingsContent />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl p-0 h-[50vh] overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-300 ease-in-out scale-100 data-[state=closed]:scale-95 data-[state=open]:scale-100">
            <DialogHeader className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={20} className="text-gray-500 dark:text-gray-400" />
                </Button>
              </div>
            </DialogHeader>
            <div className="h-full overflow-hidden">
              <SettingsContent />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
} 