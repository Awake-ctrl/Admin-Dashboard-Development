import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Switch } from "./switch";
import { Checkbox } from "./checkbox";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Slider } from "./slider";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Progress } from "./progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./breadcrumb";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  Edit, 
  Trash2, 
  Plus, 
  Settings, 
  User, 
  Bell, 
  Home,
  ChevronDown,
  Info,
  Eye,
  Heart,
  Star,
  Share,
  MoreHorizontal
} from "lucide-react";

export function UIKitShowcase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sliderValue, setSliderValue] = useState([50]);
  const [isToggled, setIsToggled] = useState(false);

  return (
    <div className="space-y-8">
      {/* Typography Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Typography System</CardTitle>
          <CardDescription>
            Complete typography hierarchy for the educational platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">H1 Heading</Label>
              <h1>Main Dashboard Title</h1>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">H2 Heading</Label>
              <h2>Section Title</h2>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">H3 Heading</Label>
              <h3>Card Title</h3>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">H4 Heading</Label>
              <h4>Component Title</h4>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Body Text</Label>
              <p>
                This is regular paragraph text used throughout the application. 
                It provides good readability and maintains consistency across all components.
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Small Text</Label>
              <p className="text-sm text-muted-foreground">
                Small helper text, captions, and secondary information.
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Extra Small Text</Label>
              <p className="text-xs text-muted-foreground">
                Metadata, timestamps, and fine print.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Colors Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Color System</CardTitle>
          <CardDescription>
            Primary, secondary, and semantic colors used across the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Colors */}
          <div>
            <Label className="text-sm mb-3 block">Primary Colors</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-2">
                <div className="w-full h-12 bg-primary rounded-lg"></div>
                <div className="text-xs">Primary</div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-secondary rounded-lg"></div>
                <div className="text-xs">Secondary</div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-muted rounded-lg"></div>
                <div className="text-xs">Muted</div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-accent rounded-lg"></div>
                <div className="text-xs">Accent</div>
              </div>
            </div>
          </div>

          {/* Semantic Colors */}
          <div>
            <Label className="text-sm mb-3 block">Semantic Colors</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-2">
                <div className="w-full h-12 bg-green-500 rounded-lg"></div>
                <div className="text-xs">Success</div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-orange-500 rounded-lg"></div>
                <div className="text-xs">Warning</div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-destructive rounded-lg"></div>
                <div className="text-xs">Error</div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-12 bg-blue-500 rounded-lg"></div>
                <div className="text-xs">Info</div>
              </div>
            </div>
          </div>

          {/* Chart Colors */}
          <div>
            <Label className="text-sm mb-3 block">Chart Colors</Label>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="space-y-2">
                  <div className={`w-full h-12 bg-chart-${num} rounded-lg`}></div>
                  <div className="text-xs">Chart {num}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Buttons & Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons & Actions</CardTitle>
          <CardDescription>
            Complete button system with variants and states
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {/* Button Variants */}
            <div>
              <Label className="text-sm mb-3 block">Button Variants</Label>
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <Label className="text-sm mb-3 block">Button Sizes</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <Label className="text-sm mb-3 block">Icon Buttons</Label>
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Loading States */}
            <div>
              <Label className="text-sm mb-3 block">Loading States</Label>
              <div className="flex flex-wrap gap-3">
                <Button disabled>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading...
                </Button>
                <Button variant="outline" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Elements */}
      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
          <CardDescription>
            Complete form components with validation states
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="normal-input">Normal Input</Label>
                <Input id="normal-input" placeholder="Enter text..." />
              </div>
              <div>
                <Label htmlFor="error-input">Error State</Label>
                <Input id="error-input" placeholder="Error input" className="border-destructive" />
                <p className="text-sm text-destructive mt-1">This field is required</p>
              </div>
              <div>
                <Label htmlFor="disabled-input">Disabled Input</Label>
                <Input id="disabled-input" placeholder="Disabled" disabled />
              </div>
            </div>

            {/* Selects and Toggles */}
            <div className="space-y-4">
              <div>
                <Label>Select Dropdown</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose option..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="switch" checked={isToggled} onCheckedChange={setIsToggled} />
                <Label htmlFor="switch">Toggle Switch</Label>
              </div>

              <div className="space-y-2">
                <Label>Checkboxes</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="check1" />
                    <Label htmlFor="check1">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="check2" checked />
                    <Label htmlFor="check2">Option 2 (checked)</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Radio Groups */}
          <div>
            <Label className="text-sm mb-3 block">Radio Group</Label>
            <RadioGroup defaultValue="option1" className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option2" id="r2" />
                <Label htmlFor="r2">Option 2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option3" id="r3" />
                <Label htmlFor="r3">Option 3</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Slider */}
          <div>
            <Label className="text-sm mb-3 block">Slider (Value: {sliderValue[0]})</Label>
            <Slider
              value={sliderValue}
              onValueChange={setSliderValue}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Interactive Components */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Components</CardTitle>
          <CardDescription>
            Tooltips, popovers, dropdowns, and search functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="space-y-4">
            <Label className="text-sm">Search & Filters</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users, courses, content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Interactive Elements */}
          <div className="flex flex-wrap gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    <Info className="w-4 h-4 mr-2" />
                    Tooltip Example
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a helpful tooltip</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  Open Popover
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-sm">Popover Content</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a popover with more detailed information.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Action</Button>
                    <Button size="sm" variant="outline">Cancel</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Menu
                  <MoreHorizontal className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Item
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Toggle Groups */}
          <div>
            <Label className="text-sm mb-3 block">Toggle Groups</Label>
            <ToggleGroup type="single" defaultValue="list">
              <ToggleGroupItem value="list">List View</ToggleGroupItem>
              <ToggleGroupItem value="grid">Grid View</ToggleGroupItem>
              <ToggleGroupItem value="card">Card View</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      {/* Cards and Data Display */}
      <Card>
        <CardHeader>
          <CardTitle>Cards & Data Display</CardTitle>
          <CardDescription>
            Various card layouts and data presentation components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Different Card Types */}
          <div className="grid gap-4 md:grid-cols-3">
            {/* Metric Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl">12,847</p>
                  </div>
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* User Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">John Doe</p>
                    <p className="text-xs text-muted-foreground">Administrator</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Course Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                  <p className="text-xs text-muted-foreground">3 of 4 modules completed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Badges */}
          <div>
            <Label className="text-sm mb-3 block">Badges</Label>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge className="bg-green-500">Success</Badge>
              <Badge className="bg-orange-500">Warning</Badge>
              <Badge className="bg-blue-500">Info</Badge>
            </div>
          </div>

          {/* Breadcrumbs */}
          <div>
            <Label className="text-sm mb-3 block">Breadcrumbs</Label>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <Home className="w-4 h-4" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/users">Users</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>User Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Responsive Example */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile Responsive Layout</CardTitle>
          <CardDescription>
            Example of how components adapt to mobile screens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted rounded-lg p-4">
            <div className="max-w-sm mx-auto bg-background border rounded-lg overflow-hidden">
              {/* Mobile Header */}
              <div className="bg-primary text-primary-foreground p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg">Dashboard</h2>
                  <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
                    <Bell className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Mobile Content */}
              <div className="p-4 space-y-4">
                {/* Mobile Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-xl">1,234</div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <div className="text-xl">56</div>
                    <div className="text-xs text-muted-foreground">Courses</div>
                  </div>
                </div>

                {/* Mobile List */}
                <div className="space-y-2">
                  <h4 className="text-sm">Recent Activity</h4>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-muted rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>U{i}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">Student completed course</div>
                          <div className="text-xs text-muted-foreground">2 hours ago</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}