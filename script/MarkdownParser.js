"use strict";
// class HtmlHandler{
//     public TextChangeHandler(id : string, output : string) : void{
//         let markdown = <HTMLTextAreaElement>document.getElementById(id);
//         let markdownOutput = <HTMLLabelElement>document.getElementById(output);
//         if(markdown !== null){
//             markdown.onkeyup = (e) =>{
//                 if(markdown.value){
//                     markdownOutput.innerHTML = markdown.value;
//                 }
//                 else 
//                 markdownOutput.innerHTML = "<p></p>";
//             }
//         }
//     }
// }
var TagType;
(function (TagType) {
    TagType[TagType["Paragraph"] = 0] = "Paragraph";
    TagType[TagType["Header1"] = 1] = "Header1";
    TagType[TagType["Header2"] = 2] = "Header2";
    TagType[TagType["Header3"] = 3] = "Header3";
    TagType[TagType["Header4"] = 4] = "Header4";
    TagType[TagType["Header5"] = 5] = "Header5";
    TagType[TagType["Header6"] = 6] = "Header6";
    TagType[TagType["HorizontalRule"] = 7] = "HorizontalRule";
})(TagType || (TagType = {}));
class TagTypeToHtml {
    // readonly 를 사용하면 인스턴스가 만들어 지고 난 뒤 클래스 어디에서도 다시 만들 수 없다.
    constructor() {
        this.tagType = new Map();
        this.tagType.set(TagType.Header1, "h1");
        this.tagType.set(TagType.Header2, "h2");
        this.tagType.set(TagType.Header3, "h3");
        this.tagType.set(TagType.Header4, "h4");
        this.tagType.set(TagType.Header5, "h5");
        this.tagType.set(TagType.Header6, "h6");
        this.tagType.set(TagType.Paragraph, "p");
        this.tagType.set(TagType.HorizontalRule, "hr");
    }
    // public OpeningTag(tagType : TagType) : string{
    //     let tag = this.tagType.get(tagType);
    //     if(tag !== null){
    //         return `<${tag}>`;
    //     }
    //     return `<p>`;
    // }
    // public ClosingTag(tagType : TagType) : string{
    //     let tag = this.tagType.get(tagType);
    //     if(tag !== null){
    //         return `</${tag}>`;
    //     }
    //     return `</p>`;
    // }
    GetTag(tagType, openingTagPattern) {
        let tag = this.tagType.get(tagType);
        if (tag !== null) {
            return `${openingTagPattern}${tag}>`;
        }
        return `${openingTagPattern}p>`;
    }
    OpeningTag(tagType) {
        return this.GetTag(tagType, `<`);
    }
    ClosingTag(tagType) {
        return this.GetTag(tagType, `</`);
    }
}
class MarkdownDocument {
    constructor() {
        this.content = "";
    }
    Add(...content) {
        content.forEach(element => {
            this.content += element;
        });
    }
    Get() {
        return this.content;
    }
}
class ParseElement {
    constructor() {
        this.CurrentLine = "";
    }
}
class VisitorBase {
    constructor(tagType, TagTypeToHtml) {
        this.tagType = tagType;
        this.TagTypeToHtml = TagTypeToHtml;
    }
    ;
    Visit(token, markdownDocument) {
        markdownDocument.Add(this.TagTypeToHtml.OpeningTag(this.tagType), token.CurrentLine, this.TagTypeToHtml.ClosingTag(this.tagType));
    }
}
class Header1Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header1, new TagTypeToHtml());
    }
}
class Header2Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header2, new TagTypeToHtml());
    }
}
class Header3Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header3, new TagTypeToHtml());
    }
}
class Header4Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header4, new TagTypeToHtml());
    }
}
class Header5Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header5, new TagTypeToHtml());
    }
}
class Header6Visitor extends VisitorBase {
    constructor() {
        super(TagType.Header6, new TagTypeToHtml());
    }
}
class ParagraphVisitor extends VisitorBase {
    constructor() {
        super(TagType.Paragraph, new (TagTypeToHtml));
    }
}
class HorizontalRuleVisitor extends VisitorBase {
    constructor() {
        super(TagType.HorizontalRule, new TagTypeToHtml());
    }
}
class Visitable {
    Accept(visitor, token, markdownDocument) {
        visitor.Visit(token, markdownDocument);
    }
}
// Handler, Chain 으로 구현 
class Handler {
    constructor() {
        this.next = null;
    }
    SetNext(next) {
        this.next = next;
    }
    HandleRequest(request) {
        var _a;
        if (!this.CanHandle(request)) {
            if (this.next !== null) {
                (_a = this.next) === null || _a === void 0 ? void 0 : _a.HandleRequest(request);
            }
            return;
        }
    }
}
class ParseChainHandler extends Handler {
    constructor(document, tagType, visitor) {
        super();
        this.document = document;
        this.tagType = tagType;
        this.visitor = visitor;
        this.visitable = new Visitable();
    }
    CanHandle(request) {
        let split = new LineParser().Parse(request.CurrentLine, this.tagType);
        if (split[0]) {
            request.CurrentLine = split[1];
            this.visitable.Accept(this.visitor, request, this.document);
        }
        return split[0];
    }
}
class LineParser {
    Parse(value, tag) {
        let output = [false, ""];
        output[1] = value;
        if (value === "") {
            return output;
        }
        let split = value.startsWith(`${tag}`);
        if (split) {
            output[0] = true;
            output[1] = value.substr(tag.length);
        }
        return output;
    }
}
class ParagraphHandler extends Handler {
    CanHandle(request) {
        this.visitable.Accept(this.visitor, request, this.document);
        return true;
    }
    constructor(document) {
        super();
        this.document = document;
        this.visitable = new Visitable();
        this.visitor = new ParagraphVisitor();
    }
}
class Header1ChainHandler extends ParseChainHandler {
    constructor(document) {
        super(document, "# ", new Header1Visitor());
    }
}
class Header2ChainHandler extends ParseChainHandler {
    constructor(document) {
        super(document, "## ", new Header2Visitor());
    }
}
class Header3ChainHandler extends ParseChainHandler {
    constructor(document) {
        super(document, "### ", new Header3Visitor());
    }
}
class Header4ChainHandler extends ParseChainHandler {
    constructor(document) {
        super(document, "#### ", new Header4Visitor());
    }
}
class Header5ChainHandler extends ParseChainHandler {
    constructor(document) {
        super(document, "##### ", new Header5Visitor());
    }
}
class Header6ChainHandler extends ParseChainHandler {
    constructor(document) {
        super(document, "###### ", new Header6Visitor());
    }
}
class HorizontalRuleHandler extends ParseChainHandler {
    constructor(document) {
        super(document, "--- ", new HorizontalRuleVisitor());
    }
}
class ChainOfResponsibilityFactory {
    Build(document) {
        let header1 = new Header1ChainHandler(document);
        let header2 = new Header2ChainHandler(document);
        let header3 = new Header3ChainHandler(document);
        let header4 = new Header4ChainHandler(document);
        let header5 = new Header5ChainHandler(document);
        let header6 = new Header6ChainHandler(document);
        let horizontalRule = new HorizontalRuleHandler(document);
        let paragraph = new ParagraphHandler(document);
        header1.SetNext(header2);
        header2.SetNext(header3);
        header3.SetNext(header4);
        header4.SetNext(header5);
        header5.SetNext(header6);
        header6.SetNext(horizontalRule);
        horizontalRule.SetNext(paragraph);
        return header1;
    }
}
class Markdown {
    ToHtml(text) {
        let document = new MarkdownDocument();
        let header1 = new ChainOfResponsibilityFactory().Build(document);
        let lines = text.split(`\n`);
        for (let index = 0; index < lines.length; index++) {
            let parseElement = new ParseElement();
            parseElement.CurrentLine = lines[index];
            header1.HandleRequest(parseElement);
        }
        return document.Get();
    }
}
class HtmlHandler {
    constructor() {
        this.markdownChange = new Markdown;
    }
    TextChangeHandler(id, output) {
        let markdown = document.getElementById(id);
        let markdownOutput = document.getElementById(output);
        if (markdown !== null) {
            markdown.onkeyup = (e) => {
                this.RenderHtmlContent(markdown, markdownOutput);
            };
            window.onload = (e) => {
                this.RenderHtmlContent(markdown, markdownOutput);
            };
        }
    }
    RenderHtmlContent(markdown, markdownOutput) {
        if (markdown.value) {
            if (markdown.value) {
                markdownOutput.innerHTML = this.markdownChange.ToHtml(markdown.value);
            }
            else
                markdownOutput.innerHTML = "<p></p>";
        }
    }
}
//# sourceMappingURL=MarkdownParser.js.map