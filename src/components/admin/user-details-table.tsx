"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Lock, Unlock, ShieldCheck, ShieldX, MailCheck, MailX, AlertTriangle } from 'lucide-react'
import type { UserDetails } from "@/types/user-details"

type Props = {
  users: UserDetails[]
  className?: string
}

function formatDateTime(value?: string | null): string {
  if (!value) return "—"
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return "—"
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "—"
  }
}

function StatusBadge({ status }: { status?: string | null }) {
  const s = (status || "").toLowerCase()
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "ACTIVE", className: "bg-green-100 text-green-800" },
    inactive: { label: "INACTIVE", className: "bg-gray-100 text-gray-800" },
    suspended: { label: "SUSPENDED", className: "bg-red-100 text-red-800" },
    pending: { label: "PENDING", className: "bg-yellow-100 text-yellow-800" },
  }
  const cfg = map[s] || map.pending
  return (
    <Badge variant="outline" className={cfg.className}>
      {cfg.label}
    </Badge>
  )
}

export function UserDetailsTable({ users, className }: Props) {
  const hasAnyRoles = useMemo(() => users.some((u) => u.roles?.length), [users])
  const hasAnyDepartments = useMemo(() => users.some((u) => u.departments?.length), [users])

  return (
    <div className={["w-full overflow-x-auto rounded-md border bg-white", className].filter(Boolean).join(" ")}>
      <Table className="min-w-[1200px]">
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead className="whitespace-nowrap">ID</TableHead>
            <TableHead className="whitespace-nowrap">Username</TableHead>
            <TableHead className="whitespace-nowrap">Full Name</TableHead>
            <TableHead className="whitespace-nowrap">Email</TableHead>
            <TableHead className="whitespace-nowrap">CPF</TableHead>
            <TableHead className="whitespace-nowrap">Roles</TableHead>
            <TableHead className="whitespace-nowrap">Departments</TableHead>
            <TableHead className="whitespace-nowrap">Position</TableHead>
            <TableHead className="whitespace-nowrap">Status</TableHead>
            <TableHead className="whitespace-nowrap">Locked</TableHead>
            <TableHead className="whitespace-nowrap">Two-Factor Enabled</TableHead>
            <TableHead className="whitespace-nowrap">Email Verified</TableHead>
            <TableHead className="whitespace-nowrap">Password Compromised</TableHead>
            <TableHead className="whitespace-nowrap">Created At</TableHead>
            <TableHead className="whitespace-nowrap">Last Login</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-mono text-xs">{u.id}</TableCell>
              <TableCell className="font-medium">@{u.username}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{u.fullName || "—"}</span>
                  {u.socialName ? <span className="text-xs text-muted-foreground">{u.socialName}</span> : null}
                </div>
              </TableCell>
              <TableCell className="break-all">{u.email}</TableCell>
              <TableCell className="font-mono text-xs">{u.cpf || "—"}</TableCell>

              <TableCell>
                {u.roles && u.roles.length ? (
                  <div className="flex flex-wrap gap-1">
                    {u.roles.map((r) => (
                      <Badge key={r} variant="outline" className="bg-purple-50 text-purple-800">
                        {r}
                      </Badge>
                    ))}
                  </div>
                ) : hasAnyRoles ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  <span className="text-muted-foreground">No roles</span>
                )}
              </TableCell>

              <TableCell>
                {u.departments && u.departments.length ? (
                  <div className="flex flex-wrap gap-1">
                    {u.departments.map((d) => (
                      <Badge key={d} variant="outline" className="bg-blue-50 text-blue-800">
                        {d}
                      </Badge>
                    ))}
                  </div>
                ) : hasAnyDepartments ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  <span className="text-muted-foreground">No departments</span>
                )}
              </TableCell>

              <TableCell>{u.position || "—"}</TableCell>

              <TableCell>
                <StatusBadge status={u.status} />
              </TableCell>

              <TableCell>
                <div className="inline-flex items-center gap-1">
                  {u.locked ? (
                    <>
                      <Lock className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-700">Yes</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">No</span>
                    </>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="inline-flex items-center gap-1">
                  {u.twoFactorEnabled ? (
                    <>
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700">Yes</span>
                    </>
                  ) : (
                    <>
                      <ShieldX className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">No</span>
                    </>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="inline-flex items-center gap-1">
                  {u.emailVerified ? (
                    <>
                      <MailCheck className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700">Yes</span>
                    </>
                  ) : (
                    <>
                      <MailX className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">No</span>
                    </>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="inline-flex items-center gap-1">
                  {u.passwordCompromised ? (
                    <>
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-700">Yes</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-600">No</span>
                  )}
                </div>
              </TableCell>

              <TableCell>{formatDateTime(u.createdAt)}</TableCell>
              <TableCell>{formatDateTime(u.lastLogin)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default UserDetailsTable
