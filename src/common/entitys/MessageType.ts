export type MessageRequestSourceType = 'Background' | 'Popup' | 'Options' | 'Content'

export interface MessageRequestEntity {
    source: MessageRequestSourceType,
    target: MessageRequestSourceType,
    handler: string
    data: Record<string, any>
}