import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SupportTicket,
  TicketChatMessage,
  TicketPriority,
  TicketStatus,
} from '../../models/business-ad.models';

@Component({
  selector: 'app-ticket-chat-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-chat-drawer.component.html',
  styleUrl: './ticket-chat-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketChatDrawerComponent implements OnInit {
  @Input({ required: true }) ticket!: SupportTicket;
  @Output() closed = new EventEmitter<void>();

  messages: TicketChatMessage[] = [];
  replyText = '';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.messages = [...(this.ticket.messages ?? [])];
  }

  @HostListener('document:keydown.escape')
  onEscape(): void { this.close(); }

  close(): void { this.closed.emit(); }

  sendReply(): void {
    const text = this.replyText.trim();
    if (!text) return;
    const now = new Date();
    const ts = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    this.messages = [
      ...this.messages,
      { id: Date.now().toString(), sender: 'user', timestamp: ts, text },
    ];
    this.replyText = '';
    this.cdr.markForCheck();
  }

  statusClass(status: TicketStatus): string {
    const map: Record<TicketStatus, string> = {
      'Open':        'tcd-status--open',
      'In Progress': 'tcd-status--in-progress',
      'Resolved':    'tcd-status--resolved',
      'Closed':      'tcd-status--closed',
    };
    return map[status];
  }

  priorityClass(priority: TicketPriority): string {
    const map: Record<TicketPriority, string> = {
      'High':   'tcd-priority--high',
      'Medium': 'tcd-priority--medium',
      'Low':    'tcd-priority--low',
    };
    return map[priority];
  }
}
