// Legacy server-side SummaryCard removed in favor of client UI/SummaryCard.
// Keep a small passthrough to avoid breaking imports that reference this file.
import React from 'react'
import SummaryCardClient from '@/components/ui/SummaryCard'

export default function LegacySummaryCard(props: any) {
  return <SummaryCardClient title={props.title} value={props.value} sub={props.description} />
}
