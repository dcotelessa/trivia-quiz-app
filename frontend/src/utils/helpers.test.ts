import { decodeHtmlEntities, getScoreColor } from './helpers';

describe('Helper Functions', () => {
  describe('decodeHtmlEntities', () => {
    it('decodes HTML entities correctly', () => {
      expect(decodeHtmlEntities('&amp; &lt; &gt; &quot; &#039;')).toBe('& < > " \'');
    });
    
    it('returns empty string for null/undefined input', () => {
      expect(decodeHtmlEntities('')).toBe('');
      expect(decodeHtmlEntities(undefined as unknown as string)).toBe('');
      expect(decodeHtmlEntities(null as unknown as string)).toBe('');
    });
    
    it('returns original string if no entities to decode', () => {
      const original = 'Hello World';
      expect(decodeHtmlEntities(original)).toBe(original);
    });
  });
  
  describe('getScoreColor', () => {
    it('returns red for low scores', () => {
      expect(getScoreColor(0)).toBe('#dc3545');
      expect(getScoreColor(20)).toBe('#dc3545');
      expect(getScoreColor(39)).toBe('#dc3545');
    });
    
    it('returns yellow for medium scores', () => {
      expect(getScoreColor(40)).toBe('#ffc107');
      expect(getScoreColor(50)).toBe('#ffc107');
      expect(getScoreColor(69)).toBe('#ffc107');
    });
    
    it('returns green for high scores', () => {
      expect(getScoreColor(70)).toBe('#28a745');
      expect(getScoreColor(85)).toBe('#28a745');
      expect(getScoreColor(100)).toBe('#28a745');
    });
  });
});
