# Componentes Reutilizáveis

## Visão Geral

O ProjectBasePronto utiliza uma abordagem baseada em componentes para construir interfaces de usuário consistentes, modulares e de fácil manutenção. Este documento apresenta os componentes reutilizáveis disponíveis no sistema, suas propriedades, variações e exemplos de uso.

Os componentes são organizados em categorias funcionais e seguem princípios de design consistentes, garantindo uma experiência de usuário coesa em toda a aplicação.

## Biblioteca de Componentes

A biblioteca de componentes do ProjectBasePronto é organizada nas seguintes categorias:

1. **Componentes de UI Básicos**: Botões, inputs, cards, etc.
2. **Componentes de Layout**: Containers, grids, dividers, etc.
3. **Componentes de Navegação**: Menus, tabs, breadcrumbs, etc.
4. **Componentes de Formulário**: Campos, validação, grupos de campos, etc.
5. **Componentes de Feedback**: Alertas, toasts, modais, etc.
6. **Componentes de Dados**: Tabelas, listas, paginação, etc.
7. **Componentes de Autenticação**: Login, registro, recuperação de senha, etc.
8. **Componentes de Visualização**: Gráficos, indicadores, estatísticas, etc.

## 1. Componentes de UI Básicos

### 1.1. Button

O componente `Button` é utilizado para ações e interações do usuário.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'link' \| 'danger'` | `'primary'` | Estilo visual do botão |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do botão |
| `isLoading` | `boolean` | `false` | Exibe indicador de carregamento |
| `isDisabled` | `boolean` | `false` | Desabilita o botão |
| `fullWidth` | `boolean` | `false` | Ocupa 100% da largura disponível |
| `leftIcon` | `ReactNode` | - | Ícone exibido à esquerda do texto |
| `rightIcon` | `ReactNode` | - | Ícone exibido à direita do texto |
| `onClick` | `() => void` | - | Função chamada ao clicar no botão |

#### Implementação

\`\`\`tsx
// src/components/ui/Button/index.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-9 px-3 rounded-md",
        md: "h-10 py-2 px-4",
        lg: "h-11 px-8 rounded-md",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    isLoading = false,
    isDisabled = false,
    leftIcon,
    rightIcon,
    children,
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Botão primário padrão
<Button>Salvar</Button>

// Botão secundário com ícone
<Button 
  variant="secondary" 
  leftIcon={<SaveIcon />}
>
  Salvar Rascunho
</Button>

// Botão de perigo desabilitado
<Button 
  variant="danger" 
  isDisabled={true}
>
  Excluir
</Button>

// Botão com estado de carregamento
<Button 
  isLoading={isSubmitting} 
  onClick={handleSubmit}
>
  {isSubmitting ? 'Enviando...' : 'Enviar'}
</Button>
\`\`\`

### 1.2. Input

O componente `Input` é utilizado para entrada de texto e dados.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamanho do input |
| `error` | `string` | - | Mensagem de erro |
| `icon` | `ReactNode` | - | Ícone exibido dentro do input |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Posição do ícone |
| `fullWidth` | `boolean` | `false` | Ocupa 100% da largura disponível |

#### Implementação

\`\`\`tsx
// src/components/ui/Input/index.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const inputVariants = cva(
  "flex rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-3 py-1 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-5 py-3 text-base",
      },
      hasError: {
        true: "border-destructive focus-visible:ring-destructive",
      },
      hasLeftIcon: {
        true: "pl-10",
      },
      hasRightIcon: {
        true: "pr-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    size, 
    error, 
    icon,
    iconPosition = 'left',
    fullWidth,
    ...props 
  }, ref) => {
    const hasError = !!error;
    const hasLeftIcon = !!icon && iconPosition === 'left';
    const hasRightIcon = !!icon && iconPosition === 'right';

    return (
      <div className="relative">
        {hasLeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={cn(
            inputVariants({ 
              size, 
              hasError, 
              hasLeftIcon, 
              hasRightIcon, 
              fullWidth,
              className 
            })
          )}
          ref={ref}
          {...props}
        />
        {hasRightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Input básico
<Input placeholder="Digite seu nome" />

// Input com ícone
<Input 
  placeholder="Pesquisar..." 
  icon={<SearchIcon />} 
/>

// Input com erro
<Input 
  placeholder="Email" 
  error="Email inválido" 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Input com tamanho grande e largura total
<Input 
  size="lg" 
  fullWidth 
  placeholder="Endereço completo" 
/>
\`\`\`

### 1.3. Card

O componente `Card` é utilizado para agrupar informações relacionadas.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `variant` | `'default' \| 'bordered' \| 'elevated'` | `'default'` | Estilo visual do card |

#### Implementação

\`\`\`tsx
// src/components/ui/Card/index.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const cardVariants = cva(
  "rounded-lg overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        bordered: "bg-card text-card-foreground border border-border",
        elevated: "bg-card text-card-foreground shadow-lg",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Card básico
<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição do card</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo do card...</p>
  </CardContent>
  <CardFooter>
    <Button>Ação</Button>
  </CardFooter>
</Card>

// Card com borda
<Card variant="bordered">
  <CardHeader>
    <CardTitle>Card com Borda</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Conteúdo do card...</p>
  </CardContent>
</Card>

// Card elevado
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Card Elevado</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Conteúdo do card...</p>
  </CardContent>
</Card>
\`\`\`

## 2. Componentes de Layout

### 2.1. Container

O componente `Container` é utilizado para centralizar e limitar a largura do conteúdo.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'lg'` | Tamanho máximo do container |

#### Implementação

\`\`\`tsx
// src/components/layout/Container/index.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const containerVariants = cva(
  "mx-auto px-4 sm:px-6 w-full",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        full: "max-w-full",
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size, className }))}
      {...props}
    />
  )
);

Container.displayName = "Container";

export { Container };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Container padrão
<Container>
  <h1>Conteúdo centralizado</h1>
  <p>Este conteúdo está centralizado e com largura limitada.</p>
</Container>

// Container pequeno
<Container size="sm">
  <p>Container com largura máxima pequena.</p>
</Container>

// Container com largura total
<Container size="full">
  <p>Container ocupando toda a largura disponível.</p>
</Container>
\`\`\`

### 2.2. Grid

O componente `Grid` é utilizado para criar layouts em grade.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `cols` | `number \| { sm?: number; md?: number; lg?: number; xl?: number }` | `1` | Número de colunas |
| `gap` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Espaçamento entre os itens |

#### Implementação

\`\`\`tsx
// src/components/layout/Grid/index.tsx
import React from 'react';
import { cn } from '@/utils/cn';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number | { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 'md', ...props }, ref) => {
    // Função para gerar classes de colunas responsivas
    const getColsClass = () => {
      if (typeof cols === 'number') {
        return `grid-cols-${cols}`;
      }
      
      const classes = [];
      
      if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
      if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
      if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
      if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
      
      return classes.join(' ');
    };
    
    // Mapeamento de gap para classes Tailwind
    const gapMap = {
      none: 'gap-0',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-8',
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          getColsClass(),
          gapMap[gap],
          className
        )}
        {...props}
      />
    );
  }
);

Grid.displayName = "Grid";

export { Grid };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Grid com 2 colunas
<Grid cols={2}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>

// Grid responsivo
<Grid cols={{ sm: 1, md: 2, lg: 3 }} gap="lg">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>

// Grid sem espaçamento
<Grid cols={3} gap="none">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>
\`\`\`

## 3. Componentes de Navegação

### 3.1. Navbar

O componente `Navbar` é utilizado para navegação principal da aplicação.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `logo` | `ReactNode` | - | Logo da aplicação |
| `fixed` | `boolean` | `false` | Fixa a navbar no topo da página |

#### Implementação

\`\`\`tsx
// src/components/navigation/Navbar/index.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  fixed?: boolean;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, logo, fixed = false, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <nav
        ref={ref}
        className={cn(
          'bg-background border-b border-border py-4',
          fixed && 'fixed top-0 left-0 right-0 z-50',
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              {logo || (
                <Link href="/" className="text-xl font-bold">
                  ProjectBasePronto
                </Link>
              )}
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {children}
            </div>
            
            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden mt-4 space-y-2">
              {children}
            </div>
          )}
        </div>
      </nav>
    );
  }
);

Navbar.displayName = "Navbar";

// Subcomponente para itens de navegação
export interface NavItemProps extends React.HTMLAttributes<HTMLLIElement> {
  href: string;
  active?: boolean;
}

const NavItem = React.forwardRef<HTMLLIElement, NavItemProps>(
  ({ className, href, active = false, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        'list-none',
        className
      )}
      {...props}
    >
      <Link
        href={href}
        className={cn(
          'block py-2 px-3 rounded-md text-sm font-medium transition-colors',
          active
            ? 'bg-primary/10 text-primary'
            : 'text-foreground/70 hover:text-foreground hover:bg-accent'
        )}
      >
        {children}
      </Link>
    </li>
  )
);

NavItem.displayName = "NavItem";

export { Navbar, NavItem };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Navbar básica
<Navbar>
  <NavItem href="/" active>Início</NavItem>
  <NavItem href="/dashboard">Dashboard</NavItem>
  <NavItem href="/profile">Perfil</NavItem>
  <NavItem href="/settings">Configurações</NavItem>
</Navbar>

// Navbar com logo personalizado
<Navbar 
  logo={<Image src="/logo.svg" alt="Logo" width={120} height={40} />}
  fixed
>
  <NavItem href="/" active>Início</NavItem>
  <NavItem href="/features">Recursos</NavItem>
  <NavItem href="/pricing">Preços</NavItem>
  <NavItem href="/contact">Contato</NavItem>
</Navbar>
\`\`\`

### 3.2. Tabs

O componente `Tabs` é utilizado para alternar entre diferentes seções de conteúdo.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `defaultValue` | `string` | - | Valor da tab selecionada por padrão |
| `value` | `string` | - | Valor da tab selecionada (controlado) |
| `onValueChange` | `(value: string) => void` | - | Função chamada quando a tab muda |

#### Implementação

\`\`\`tsx
// src/components/navigation/Tabs/index.tsx
import React from 'react';
import { cn } from '@/utils/cn';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    // Estado interno para tabs não controladas
    const [selectedTab, setSelectedTab] = React.useState(defaultValue);
    
    // Determinar o valor atual (controlado ou não controlado)
    const currentValue = value !== undefined ? value : selectedTab;
    
    // Manipulador de mudança de tab
    const handleTabChange = (newValue: string) => {
      if (value === undefined) {
        setSelectedTab(newValue);
      }
      onValueChange?.(newValue);
    };
    
    // Contexto para compartilhar estado com TabsList, TabsTrigger e TabsContent
    const tabsContext = React.useMemo(() => ({
      value: currentValue,
      onValueChange: handleTabChange,
    }), [currentValue, handleTabChange]);
    
    return (
      <div
        ref={ref}
        className={cn('', className)}
        {...props}
      >
        <TabsContext.Provider value={tabsContext}>
          {children}
        </TabsContext.Provider>
      </div>
    );
  }
);

Tabs.displayName = "Tabs";

// Contexto para compartilhar estado entre componentes de tabs
type TabsContextValue = {
  value?: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Componentes de Tabs devem ser usados dentro de um Tabs');
  }
  return context;
};

// Componente para lista de tabs
export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-muted p-1',
        className
      )}
      {...props}
    />
  )
);

TabsList.displayName = "TabsList";

// Componente para trigger de tab
export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useTabsContext();
    const isSelected = selectedValue === value;
    
    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        data-state={isSelected ? "active" : "inactive"}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isSelected
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = "TabsTrigger";

// Componente para conteúdo de tab
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext();
    const isSelected = selectedValue === value;
    
    if (!isSelected) return null;
    
    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isSelected ? "active" : "inactive"}
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      />
    );
  }
);

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Tabs básico
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Conta</TabsTrigger>
    <TabsTrigger value="password">Senha</TabsTrigger>
    <TabsTrigger value="notifications">Notificações</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <h3>Configurações de Conta</h3>
    <p>Gerencie suas informações de conta.</p>
  </TabsContent>
  <TabsContent value="password">
    <h3>Alterar Senha</h3>
    <p>Atualize sua senha.</p>
  </TabsContent>
  <TabsContent value="notifications">
    <h3>Preferências de Notificação</h3>
    <p>Gerencie como você recebe notificações.</p>
  </TabsContent>
</Tabs>

// Tabs controlado
<Tabs 
  value={activeTab} 
  onValueChange={setActiveTab}
>
  <TabsList>
    <TabsTrigger value="details">Detalhes</TabsTrigger>
    <TabsTrigger value="preview">Visualização</TabsTrigger>
  </TabsList>
  <TabsContent value="details">
    <p>Conteúdo de detalhes...</p>
  </TabsContent>
  <TabsContent value="preview">
    <p>Conteúdo de visualização...</p>
  </TabsContent>
</Tabs>
\`\`\`

## 4. Componentes de Formulário

### 4.1. Form

O componente `Form` é utilizado para criar formulários com validação.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `onSubmit` | `(values: any) => void` | - | Função chamada ao submeter o formulário |
| `defaultValues` | `object` | `{}` | Valores iniciais dos campos |
| `validationSchema` | `object` | - | Schema de validação (Yup/Zod) |

#### Implementação

\`\`\`tsx
// src/components/form/Form/index.tsx
import React from 'react';
import { useForm, FormProvider, UseFormProps, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/utils/cn';

export interface FormProps<TFormValues extends Record<string, any> = Record<string, any>>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: SubmitHandler<TFormValues>;
  defaultValues?: Partial<TFormValues>;
  validationSchema?: z.ZodType<TFormValues>;
  children: React.ReactNode;
}

export function Form<TFormValues extends Record<string, any> = Record<string, any>>({
  onSubmit,
  defaultValues = {} as Partial<TFormValues>,
  validationSchema,
  children,
  className,
  ...props
}: FormProps<TFormValues>) {
  // Configurar opções do useForm
  const formOptions: UseFormProps<TFormValues> = {
    defaultValues: defaultValues as any,
    mode: 'onBlur',
  };

  // Adicionar resolver se schema de validação for fornecido
  if (validationSchema) {
    formOptions.resolver = zodResolver(validationSchema);
  }

  // Criar métodos do formulário
  const methods = useForm<TFormValues>(formOptions);

  return (
    <FormProvider {...methods}>
      <form
        className={cn('space-y-4', className)}
        onSubmit={methods.handleSubmit(onSubmit)}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

// Componente para campo de formulário
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  label?: string;
  helperText?: string;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, name, label, helperText, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        {children}
        {helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

// Hook para obter erro de um campo
export function useFormField(name: string) {
  const { formState } = useForm();
  const error = formState.errors[name];
  
  return {
    error: error ? (error.message as string) : undefined,
  };
}
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Formulário básico
<Form onSubmit={handleSubmit}>
  <FormField name="name" label="Nome">
    <Input name="name" placeholder="Digite seu nome" />
  </FormField>
  <FormField name="email" label="Email">
    <Input name="email" type="email" placeholder="Digite seu email" />
  </FormField>
  <Button type="submit">Enviar</Button>
</Form>

// Formulário com validação
const schema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

<Form 
  onSubmit={handleSubmit} 
  validationSchema={schema}
  defaultValues={{ name: '', email: '', password: '' }}
>
  <FormField name="name" label="Nome">
    <Input name="name" placeholder="Digite seu nome" />
  </FormField>
  <FormField name="email" label="Email">
    <Input name="email" type="email" placeholder="Digite seu email" />
  </FormField>
  <FormField name="password" label="Senha">
    <Input name="password" type="password" placeholder="Digite sua senha" />
  </FormField>
  <Button type="submit">Cadastrar</Button>
</Form>
\`\`\`

### 4.2. Select

O componente `Select` é utilizado para seleção de opções em formulários.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `options` | `Array<{ value: string; label: string }>` | `[]` | Opções disponíveis |
| `placeholder` | `string` | - | Texto exibido quando nenhuma opção está selecionada |
| `error` | `string` | - | Mensagem de erro |

#### Implementação

\`\`\`tsx
// src/components/form/Select/index.tsx
import React, { useState } from 'react';
import { cn } from '@/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  error?: string;
  onChange?: (value: string) => void;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, error, onChange, placeholder, value, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          value={value}
          onChange={handleChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Select básico
<Select
  options={[
    { value: 'apple', label: 'Maçã' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Laranja' },
  ]}
  placeholder="Selecione uma fruta"
/>

// Select com erro
<Select
  options={[
    { value: 'br', label: 'Brasil' },
    { value: 'us', label: 'Estados Unidos' },
    { value: 'ca', label: 'Canadá' },
  ]}
  placeholder="Selecione um país"
  error="Por favor, selecione um país"
/>

// Select controlado
<Select
  options={countryOptions}
  value={selectedCountry}
  onChange={setSelectedCountry}
  placeholder="Selecione um país"
/>
\`\`\`

## 5. Componentes de Feedback

### 5.1. Alert

O componente `Alert` é utilizado para exibir mensagens importantes para o usuário.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Tipo de alerta |
| `title` | `string` | - | Título do alerta |
| `icon` | `ReactNode` | - | Ícone personalizado |
| `onClose` | `() => void` | - | Função chamada ao fechar o alerta |

#### Implementação

\`\`\`tsx
// src/components/feedback/Alert/index.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        info: "bg-blue-50 border-blue-200 text-blue-800",
        success: "bg-green-50 border-green-200 text-green-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        error: "bg-red-50 border-red-200 text-red-800",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, icon, onClose, children, ...props }, ref) => {
    // Ícones padrão baseados na variante
    const defaultIcons = {
      info: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      success: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
      error: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
    };

    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        role="alert"
        {...props}
      >
        {onClose && (
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
            onClick={onClose}
            aria-label="Fechar"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <div className="flex">
          {(icon || defaultIcons[variant || 'info']) && (
            <div className="flex-shrink-0 mr-3">
              {icon || defaultIcons[variant || 'info']}
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-sm font-medium mb-1">{title}</h3>
            )}
            <div className="text-sm">{children}</div>
          </div>
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Alerta de informação
<Alert>
  Esta é uma mensagem informativa.
</Alert>

// Alerta de sucesso com título
<Alert 
  variant="success" 
  title="Operação concluída"
>
  Seus dados foram salvos com sucesso.
</Alert>

// Alerta de erro com botão de fechar
<Alert 
  variant="error" 
  title="Erro ao processar" 
  onClose={() => setShowError(false)}
>
  Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.
</Alert>
\`\`\`

### 5.2. Toast

O componente `Toast` é utilizado para exibir notificações temporárias.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'error'` | `'default'` | Tipo de toast |
| `title` | `string` | - | Título do toast |
| `description` | `string` | - | Descrição do toast |
| `duration` | `number` | `5000` | Duração em milissegundos |

#### Implementação

\`\`\`tsx
// src/components/feedback/Toast/index.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 rounded-lg shadow-lg p-4 min-w-[300px] max-w-md transform transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-background border border-border",
        success: "bg-green-50 border border-green-200 text-green-800",
        warning: "bg-yellow-50 border border-yellow-200 text-yellow-800",
        error: "bg-red-50 border border-red-200 text-red-800",
      },
      state: {
        open: "translate-y-0 opacity-100",
        closed: "translate-y-2 opacity-0 pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "default",
      state: "closed",
    },
  }
);

export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof toastVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  duration?: number;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ 
    className, 
    variant, 
    open = false, 
    onOpenChange,
    title,
    description,
    duration = 5000,
    ...props 
  }, ref) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(open);
    
    // Efeito para montar o componente no cliente
    useEffect(() => {
      setIsMounted(true);
      return () => setIsMounted(false);
    }, []);
    
    // Efeito para controlar visibilidade baseado na prop open
    useEffect(() => {
      setIsVisible(open);
      
      if (open && duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onOpenChange?.(false);
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }, [open, duration, onOpenChange]);
    
    // Manipulador para fechar o toast
    const handleClose = () => {
      setIsVisible(false);
      onOpenChange?.(false);
    };
    
    if (!isMounted) return null;
    
    return createPortal(
      <div
        ref={ref}
        className={cn(
          toastVariants({ 
            variant, 
            state: isVisible ? 'open' : 'closed',
            className 
          })
        )}
        role="alert"
        {...props}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {title && (
              <h3 className="font-medium text-sm">{title}</h3>
            )}
            {description && (
              <p className="text-sm mt-1">{description}</p>
            )}
          </div>
          <button
            type="button"
            className="ml-4 text-gray-400 hover:text-gray-900"
            onClick={handleClose}
            aria-label="Fechar"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>,
      document.body
    );
  }
);

Toast.displayName = "Toast";

// Hook para gerenciar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    variant?: ToastProps['variant'];
    title?: string;
    description?: string;
    duration?: number;
  }>>([]);
  
  const toast = {
    show: (props: Omit<ToastProps, 'open' | 'onOpenChange'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, ...props }]);
      
      if (props.duration !== 0) {
        setTimeout(() => {
          toast.dismiss(id);
        }, props.duration || 5000);
      }
      
      return id;
    },
    dismiss: (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    },
    dismissAll: () => {
      setToasts([]);
    },
  };
  
  // Componente para renderizar todos os toasts
  const Toasts = () => (
    <>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          open={true}
          variant={t.variant}
          title={t.title}
          description={t.description}
          duration={t.duration}
          onOpenChange={(open) => {
            if (!open) toast.dismiss(t.id);
          }}
        />
      ))}
    </>
  );
  
  return { toast, Toasts };
}

export { Toast };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Uso com hook useToast
function MyComponent() {
  const { toast, Toasts } = useToast();
  
  const showSuccessToast = () => {
    toast.show({
      variant: 'success',
      title: 'Sucesso!',
      description: 'Operação realizada com sucesso.',
    });
  };
  
  const showErrorToast = () => {
    toast.show({
      variant: 'error',
      title: 'Erro!',
      description: 'Ocorreu um erro ao processar sua solicitação.',
      duration: 10000, // 10 segundos
    });
  };
  
  return (
    <div>
      <Button onClick={showSuccessToast}>Mostrar Toast de Sucesso</Button>
      <Button onClick={showErrorToast}>Mostrar Toast de Erro</Button>
      <Toasts />
    </div>
  );
}

// Uso direto do componente Toast
function AnotherComponent() {
  const [showToast, setShowToast] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setShowToast(true)}>
        Mostrar Toast
      </Button>
      
      <Toast
        open={showToast}
        onOpenChange={setShowToast}
        title="Notificação"
        description="Esta é uma notificação importante."
        variant="default"
      />
    </div>
  );
}
\`\`\`

## 6. Componentes de Dados

### 6.1. Table

O componente `Table` é utilizado para exibir dados tabulares.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `data` | `Array<any>` | `[]` | Dados a serem exibidos |
| `columns` | `Array<{ key: string; header: string; render?: (row: any) => ReactNode }>` | `[]` | Definição das colunas |
| `striped` | `boolean` | `false` | Aplica estilo listrado às linhas |
| `hoverable` | `boolean` | `false` | Aplica efeito hover às linhas |

#### Implementação

\`\`\`tsx
// src/components/data/Table/index.tsx
import React from 'react';
import { cn } from '@/utils/cn';

export interface TableColumn<T = any> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface TableProps<T = any> extends React.TableHTMLAttributes<HTMLTableElement> {
  data: T[];
  columns: TableColumn<T>[];
  striped?: boolean;
  hoverable?: boolean;
  emptyState?: React.ReactNode;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, data, columns, striped = false, hoverable = false, emptyState, ...props }, ref) => {
    const isEmpty = data.length === 0;
    
    return (
      <div className="w-full overflow-auto">
        <table
          ref={ref}
          className={cn(
            'w-full caption-bottom text-sm',
            className
          )}
          {...props}
        >
          <thead className="border-b">
            <tr className="bg-muted/50">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isEmpty ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 text-center text-muted-foreground"
                >
                  {emptyState || 'Nenhum dado encontrado'}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    'border-b transition-colors',
                    striped && rowIndex % 2 === 1 && 'bg-muted/50',
                    hoverable && 'hover:bg-muted/50'
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className={cn('p-4 align-middle', column.className)}
                    >
                      {column.render
                        ? column.render(row, rowIndex)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";

export { Table };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Tabela básica
const columns = [
  { key: 'name', header: 'Nome' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Função' },
];

const data = [
  { name: 'João Silva', email: 'joao@example.com', role: 'Admin' },
  { name: 'Maria Santos', email: 'maria@example.com', role: 'Usuário' },
  { name: 'Pedro Oliveira', email: 'pedro@example.com', role: 'Editor' },
];

<Table
  columns={columns}
  data={data}
  striped
  hoverable
/>

// Tabela com renderização personalizada
const columnsWithActions = [
  { key: 'name', header: 'Nome' },
  { key: 'email', header: 'Email' },
  { key: 'status', 
    header: 'Status', 
    render: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        row.status === 'active' ? 'bg-green-100 text-green-800' : 
        row.status === 'inactive' ? 'bg-red-100 text-red-800' : 
        'bg-gray-100 text-gray-800'
      }`}>
        {row.status === 'active' ? 'Ativo' : 
         row.status === 'inactive' ? 'Inativo' : 'Pendente'}
      </span>
    )
  },
  { 
    key: 'actions', 
    header: 'Ações',
    render: (row) => (
      <div className="flex space-x-2">
        <Button size="sm" variant="outline">Editar</Button>
        <Button size="sm" variant="danger">Excluir</Button>
      </div>
    )
  },
];

const usersData = [
  { name: 'João Silva', email: 'joao@example.com', status: 'active' },
  { name: 'Maria Santos', email: 'maria@example.com', status: 'inactive' },
  { name: 'Pedro Oliveira', email: 'pedro@example.com', status: 'pending' },
];

<Table
  columns={columnsWithActions}
  data={usersData}
  emptyState={
    <div className="text-center py-8">
      <p>Nenhum usuário encontrado</p>
      <Button className="mt-4">Adicionar Usuário</Button>
    </div>
  }
/>
\`\`\`

### 6.2. Pagination

O componente `Pagination` é utilizado para navegação entre páginas de dados.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `currentPage` | `number` | `1` | Página atual |
| `totalPages` | `number` | `1` | Total de páginas |
| `onPageChange` | `(page: number) => void` | - | Função chamada ao mudar de página |
| `siblingCount` | `number` | `1` | Número de páginas adjacentes a mostrar |

#### Implementação

\`\`\`tsx
// src/components/data/Pagination/index.tsx
import React from 'react';
import { cn } from '@/utils/cn';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ 
    className, 
    currentPage, 
    totalPages, 
    onPageChange, 
    siblingCount = 1,
    ...props 
  }, ref) => {
    // Gerar array de páginas a serem exibidas
    const getPageNumbers = () => {
      const totalPageNumbers = siblingCount * 2 + 3; // Siblings + current + first + last
      
      // Caso o número total de páginas seja menor que o total a ser exibido
      if (totalPageNumbers >= totalPages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      // Calcular páginas irmãs à esquerda e direita
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      
      // Não mostrar dots quando há apenas uma página escondida
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
      
      // Caso 1: Mostrar dots à direita
      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 1 + 2 * siblingCount;
        const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
        
        return [...leftRange, 'dots', totalPages];
      }
      
      // Caso 2: Mostrar dots à esquerda
      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 1 + 2 * siblingCount;
        const rightRange = Array.from(
          { length: rightItemCount }, 
          (_, i) => totalPages - rightItemCount + i + 1
        );
        
        return [1, 'dots', ...rightRange];
      }
      
      // Caso 3: Mostrar dots em ambos os lados
      if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, i) => leftSiblingIndex + i
        );
        
        return [1, 'dots', ...middleRange, 'dots', totalPages];
      }
      
      return [];
    };
    
    const pageNumbers = getPageNumbers();
    
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center space-x-2', className)}
        {...props}
      >
        {/* Botão Anterior */}
        <button
          className={cn(
            'inline-flex items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          )}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        
        {/* Números de Página */}
        {pageNumbers.map((pageNumber, i) => {
          if (pageNumber === 'dots') {
            return (
              <span
                key={`dots-${i}`}
                className="px-2 text-gray-500"
              >
                ...
              </span>
            );
          }
          
          return (
            <button
              key={pageNumber}
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors',
                currentPage === pageNumber
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background hover:bg-accent hover:text-accent-foreground'
              )}
              onClick={() => onPageChange(pageNumber as number)}
              aria-current={currentPage === pageNumber ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          );
        })}
        
        {/* Botão Próximo */}
        <button
          className={cn(
            'inline-flex items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          )}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Próxima página"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Paginação básica
function PaginatedContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  
  return (
    <div>
      <div className="mb-4">
        <p>Conteúdo da página {currentPage}</p>
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

// Paginação com tabela
function PaginatedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  
  // Dados de exemplo
  const allItems = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    description: `Descrição do item ${i + 1}`,
  }));
  
  // Calcular total de páginas
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  
  // Obter itens da página atual
  const currentItems = allItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Colunas da tabela
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Nome' },
    { key: 'description', header: 'Descrição' },
  ];
  
  return (
    <div>
      <Table
        columns={columns}
        data={currentItems}
        striped
        hoverable
      />
      
      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
\`\`\`

## 7. Componentes de Autenticação

### 7.1. LoginForm

O componente `LoginForm` é utilizado para autenticação de usuários.

#### Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `onSubmit` | `(values: { email: string; password: string }) => Promise<void>` | - | Função chamada ao submeter o formulário |
| `isLoading` | `boolean` | `false` | Indica se o formulário está em processo de submissão |
| `error` | `string` | - | Mensagem de erro a ser exibida |

#### Implementação

\`\`\`tsx
// src/components/auth/LoginForm/index.tsx
import React, { useState } from 'react';
import { z } from 'zod';
import { Form, FormField } from '@/components/form/Form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/feedback/Alert';
import Link from 'next/link';

export interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const LoginForm = React.forwardRef<HTMLDivElement, LoginFormProps>(
  ({ className, onSubmit, isLoading = false, error, ...props }, ref) => {
    const [formError, setFormError] = useState<string | null>(error || null);
    
    const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
      try {
        setFormError(null);
        await onSubmit(values);
      } catch (err) {
        if (err instanceof Error) {
          setFormError(err.message);
        } else {
          setFormError('Ocorreu um erro durante o login');
        }
      }
    };
    
    return (
      <div ref={ref} className={className} {...props}>
        {(formError || error) && (
          <Alert 
            variant="error" 
            className="mb-4"
            onClose={() => setFormError(null)}
          >
            {formError || error}
          </Alert>
        )}
        
        <Form
          onSubmit={handleSubmit}
          validationSchema={loginSchema}
          defaultValues={{ email: '', password: '' }}
        >
          <FormField name="email" label="Email">
            <Input
              name="email"
              type="email"
              placeholder="seu@email.com"
              disabled={isLoading}
              autoComplete="email"
            />
          </FormField>
          
          <FormField name="password" label="Senha">
            <Input
              name="password"
              type="password"
              placeholder="Sua senha"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </FormField>
          
          <div className="flex items-center justify-between mt-2 mb-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Lembrar-me
              </label>
            </div>
            
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary hover:text-primary/80"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>
          
          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
        
        <div className="mt-6 text-center text-sm">
          <p>
            Não tem uma conta?{' '}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    );
  }
);

LoginForm.displayName = "LoginForm";

export { LoginForm };
\`\`\`

#### Exemplos de Uso

\`\`\`tsx
// Formulário de login básico
function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Chamar serviço de autenticação
      const result = await authService.login(values.email, values.password);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || 'Falha na autenticação');
      }
    } catch (err) {
      setError('Ocorreu um erro durante o login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error || undefined}
        />
      </div>
    </div>
  );
}
\`\`\`

## Boas Práticas para Criação de Componentes

### 1. Princípios de Design

Ao criar novos componentes, siga estes princípios:

1. **Composabilidade**: Componentes devem ser facilmente combinados para criar interfaces mais complexas
2. **Reutilização**: Componentes devem ser projetados para serem reutilizados em diferentes contextos
3. **Responsabilidade Única**: Cada componente deve ter uma única responsabilidade
4. **Consistência**: Componentes devem seguir padrões consistentes de API e estilo
5. **Acessibilidade**: Componentes devem ser acessíveis para todos os usuários

### 2. Estrutura de Componentes

Siga esta estrutura ao criar novos componentes:

\`\`\`
src/components/[categoria]/[NomeComponente]/
├── index.tsx         # Implementação principal
├── [NomeComponente].test.tsx  # Testes
└── types.ts          # Tipos (opcional)
\`\`\`

### 3. Padrões de API

Mantenha uma API consistente entre componentes:

1. **Nomenclatura**: Use nomes descritivos e consistentes para props
2. **Composição**: Use o padrão de composição do React (`children`)
3. **Refs**: Suporte refs usando `React.forwardRef`
4. **Estilos**: Permita personalização de estilos via `className`
5. **Eventos**: Use nomes de eventos padrão do React (`onClick`, `onChange`, etc.)

### 4. Acessibilidade

Garanta que seus componentes sejam acessíveis:

1. Use elementos semânticos apropriados
2. Forneça textos alternativos para imagens
3. Garanta contraste adequado de cores
4. Suporte navegação por teclado
5. Implemente ARIA roles e atributos quando necessário

### 5. Testes

Escreva testes para seus componentes:

1. Teste o comportamento esperado
2. Teste casos de erro
3. Teste interações do usuário
4. Teste acessibilidade

## Conclusão

Os componentes reutilizáveis do ProjectBasePronto fornecem uma base sólida para construir interfaces de usuário consistentes e de alta qualidade. Ao seguir os padrões e práticas descritos neste documento, você pode criar novos componentes que se integram perfeitamente ao sistema existente.

A biblioteca de componentes é extensível e pode ser adaptada para atender às necessidades específicas do seu projeto. Use os componentes existentes como referência ao criar novos componentes e mantenha a consistência em toda a aplicação.

Para mais informações sobre como usar e estender esses componentes, consulte os exemplos de código e a documentação de API fornecida.
