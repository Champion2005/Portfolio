# GitHub Copilot Instructions for Portfolio Design Enhancement

## Overview
You are assisting in significantly improving the design of a modern React + Vite portfolio website. Focus on creating a cohesive, polished, and visually stunning user experience that showcases professional work effectively.

## Design System

### Color Palette
- **Background**: `#f4f4f9` (light base)
- **Background2**: `#ccc5b9` (accent)
- **Primary Text**: `#2f4550` (dark blue-gray)
- **Secondary Text**: `#b8dbd9` (muted teal)
- **Accent**: `#b8dbd9` (teal)
- **Gradients**: Purple to Blue (e.g., `from-purple-600 to-blue-600`)

### Typography
- **Font Family**: Inter (sans-serif)
- **Hierarchy**: Clear weight differentiation (400, 500, 600, 700)
- **Spacing**: Generous padding/margins for breathing room

## Tech Stack for Design
- **React 18.3.1** - Component-based architecture
- **Tailwind CSS 4.0** - Utility-first styling with custom theme
- **Framer Motion** - Smooth animations and micro-interactions
- **Vite** - Fast development and optimized builds

## Design Principles

### 1. Visual Hierarchy
- Use Tailwind's responsive classes (`sm:`, `md:`, `lg:`) consistently
- Ensure text scales appropriately across all devices
- Prioritize content importance through size and color contrast

### 2. Animations & Motion
- Leverage Framer Motion for entrance animations
- Use `whileInView` for scroll-triggered effects
- Keep animations under 0.5s for snappy feel
- Add subtle micro-interactions (hover states, transitions)

### 3. Spacing & Layout
- Use consistent grid systems (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3`)
- Maintain visual rhythm with uniform gap sizes
- Ensure mobile-first responsive design
- Add breathing room around components

### 4. Component Design
- **Cards**: Consistent rounded corners (`rounded-2xl`), shadows (`shadow-md`)
- **Buttons**: Hover effects, smooth transitions, clear affordance
- **Links**: Underlines, hover color changes, smooth animations
- **Icons**: Proper sizing, alignment, and spacing within elements

### 5. Interactive Elements
- Buttons should have clear hover states and scale/color changes
- Forms should have smooth focus states
- Smooth scrolling navigation
- Loading/transition states for better UX

## Content Organization

### Hero Section
- Bold gradient text for name
- Clear value proposition
- Prominent CTA button to portfolio

### About Me
- Readable text blocks with proper line-height
- Highlight key skills/companies
- Link styling consistent across site

### Projects
- High-quality project cards with images
- Tech stack badges with hover effects
- Multiple CTA options (GitHub, Demo, Video)
- Show/More/Less functionality for descriptions

### Skills
- Visual tech stack with icons
- Categorized skill grid
- List animations for engagement
- Proper icon sizing and spacing

### Navigation & Footer
- Fixed navbar with backdrop blur
- Icon buttons with consistent styling
- Contact links in footer
- Copyright information

## Implementation Guidelines

### When Suggesting Changes
1. **Improve visual consistency** - Ensure all components follow design system
2. **Enhance interactivity** - Add meaningful animations and transitions
3. **Optimize readability** - Improve contrast, spacing, and typography
4. **Refine responsiveness** - Test suggestions across breakpoints
5. **Add polish** - Smooth interactions, hover states, loading states

### Code Quality
- Keep components modular and reusable
- Use Tailwind utilities over custom CSS when possible
- Maintain semantic HTML structure
- Follow React best practices
- Ensure accessibility (alt text, ARIA labels, keyboard navigation)

### Performance
- Lazy load images where appropriate
- Optimize animation performance
- Use CSS transforms for animations
- Minimize re-renders with proper React patterns

## Design Goals
- Create a **premium, professional appearance**
- Ensure **excellent user experience** across all devices
- Showcase projects with **visual impact**
- Maintain **brand consistency** throughout
- Achieve **modern, clean aesthetics** while being functional

## When You're Unsure
Ask clarifying questions about:
- Specific component behavior
- Visual direction preferences
- Target audience considerations
- Performance constraints